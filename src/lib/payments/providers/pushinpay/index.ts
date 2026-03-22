import { IPaymentProvider, PaymentCustomer, PaymentCardDetails, CreateChargeResult } from "../../adapter";

export class PushinPayAdapter implements IPaymentProvider {
  private apiKey: string;
  private baseUrl = "https://api.pushinpay.com.br/v1";

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("PushinPay API Key é obrigatória.");
    this.apiKey = apiKey;
  }

  private async fetchApi(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        ...(options.headers || {})
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `PushinPay Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async createPixCharge(orderId: string, amount: number, customer: PaymentCustomer): Promise<CreateChargeResult> {
    try {
      // Endpoint ilustrativo - ajuste de acordo com a doc oficial da PushinPay caso ela mude
      const payload = {
        value: Math.round(amount * 100), // PushinPay tipicamente usa centavos
        reference: orderId,
        customer: {
          name: customer.name,
          email: customer.email,
          cpfCnpj: customer.document.replace(/\D/g, "")
        }
      };

      const response = await this.fetchApi("/transactions/pix", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        txid: response.id,
        qrCodeBase64: response.qr_code_base64 || "url_indisponivel",
        pixCopiaECola: response.qr_code || "indisponivel",
        status: "PENDING"
      };
    } catch (error: any) {
      console.error("[PushinPay PIX Error]", error);
      return { success: false, status: "FAILED", error: error.message || "Erro de Integração PushinPay" };
    }
  }

  async createCardCharge(orderId: string, amount: number, customer: PaymentCustomer, cardDetails: PaymentCardDetails): Promise<CreateChargeResult> {
    try {
      const payload = {
        value: Math.round(amount * 100),
        reference: orderId,
        installments: 1,
        credit_card_token: cardDetails.number, // Requer tokenização prévia no front
        customer: {
          name: customer.name,
          email: customer.email,
          cpfCnpj: customer.document.replace(/\D/g, "")
        }
      };

      const response = await this.fetchApi("/transactions/credit-card", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      return {
        success: response.status === "approved",
        txid: response.id,
        status: response.status === "approved" ? "PAID" : "FAILED",
        error: response.status !== "approved" ? response.reason : undefined
      };
    } catch (error: any) {
      console.error("[PushinPay CARD Error]", error);
      return { success: false, status: "FAILED", error: error.message || "Erro no processamento de Cartão" };
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return true; 
  }
}
