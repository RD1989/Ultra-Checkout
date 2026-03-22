import { IPaymentProvider, PaymentCustomer, PaymentCardDetails, CreateChargeResult } from "../../adapter";

export class HypercashAdapter implements IPaymentProvider {
  private secretKey: string;
  private baseUrl = "https://api.hypercash.com.br/api/v1";

  constructor(secretKey: string) {
    if (!secretKey) throw new Error("Hypercash Secret Key é obrigatória.");
    this.secretKey = secretKey;
  }

  private async fetchApi(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.secretKey, // Hypercash tipicamente usa chave customizada no header
        ...(options.headers || {})
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Hypercash Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async createPixCharge(orderId: string, amount: number, customer: PaymentCustomer): Promise<CreateChargeResult> {
    try {
      const response = await this.fetchApi("/payments/pix", {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount).toFixed(2), // Trabalha com string e casas decimais
          external_reference: orderId,
          payer: {
            name: customer.name,
            email: customer.email,
            document: customer.document.replace(/\D/g, "")
          }
        })
      });

      return {
        success: true,
        txid: response.transaction_id,
        qrCodeBase64: response.qr_code_image || "url_indisponivel",
        pixCopiaECola: response.qr_code_emv || "indisponivel",
        status: "PENDING"
      };
    } catch (error: any) {
      console.error("[Hypercash PIX Error]", error);
      return { success: false, status: "FAILED", error: error.message || "Falha na cobrança Pix - Hypercash" };
    }
  }

  async createCardCharge(orderId: string, amount: number, customer: PaymentCustomer, cardDetails: PaymentCardDetails): Promise<CreateChargeResult> {
    try {
      const response = await this.fetchApi("/payments/card", {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount).toFixed(2),
          external_reference: orderId,
          card_token: cardDetails.number, 
          installments: 1,
          payer: {
            name: customer.name,
            email: customer.email,
            document: customer.document.replace(/\D/g, "")
          }
        })
      });

      const isApproved = response.status === "AUTHORIZED" || response.status === "PAID";

      return {
        success: isApproved,
        txid: response.transaction_id,
        status: isApproved ? "PAID" : "FAILED",
        error: !isApproved ? response.decline_message : undefined
      };
    } catch (error: any) {
      console.error("[Hypercash CARD Error]", error);
      return { success: false, status: "FAILED", error: error.message || "Falha na cobrança de Cartão" };
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return true; 
  }
}
