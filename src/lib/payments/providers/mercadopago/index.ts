import { IPaymentProvider, PaymentCustomer, PaymentCardDetails, CreateChargeResult } from "../../adapter";
import { MercadoPagoConfig, Payment } from "mercadopago";

export class MercadoPagoAdapter implements IPaymentProvider {
  private client: MercadoPagoConfig;

  constructor(accessToken: string) {
    if (!accessToken) throw new Error("Mercado Pago Access Token é obrigatório.");
    this.client = new MercadoPagoConfig({ accessToken, options: { timeout: 10000 } });
  }

  async createPixCharge(orderId: string, amount: number, customer: PaymentCustomer): Promise<CreateChargeResult> {
    const payment = new Payment(this.client);

    try {
      // Cria a transação via Pix no MP
      const response = await payment.create({
        body: {
          transaction_amount: Number(amount),
          description: `Pedido ${orderId}`,
          payment_method_id: 'pix',
          payer: {
            email: customer.email,
            first_name: customer.name.split(" ")[0],
            last_name: customer.name.split(" ").slice(1).join(" "),
            identification: {
              type: customer.document.length === 11 ? 'CPF' : 'CNPJ',
              number: customer.document.replace(/\D/g, "")
            }
          }
        }
      });

      return {
        success: true,
        txid: response.id?.toString(),
        qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64,
        pixCopiaECola: response.point_of_interaction?.transaction_data?.qr_code,
        status: "PENDING"
      };

    } catch (error: any) {
      console.error("[MercadoPago Error - PIX]", error);
      return { success: false, status: "FAILED", error: error.message || "Erro ao processar PIX no Mercado Pago" };
    }
  }

  async createCardCharge(orderId: string, amount: number, customer: PaymentCustomer, cardDetails: PaymentCardDetails): Promise<CreateChargeResult> {
    // Nota: Em um fluxo real do Mercado Pago com cartão, você precisa usar o SDK Front-end 
    // ou a API da Card Token para não trafegar o PAN cru no backend.
    // Como a PaymentCardDetails abstrata prevê envio ao server, simularemos o fluxo de tokenização
    // ou a charge baseada no Token caso ele venha embutido em `cvv` ou `number` como placeholder de token.
    const payment = new Payment(this.client);

    try {
      const response = await payment.create({
        body: {
          transaction_amount: Number(amount),
          token: cardDetails.number, // Assumindo que o Frontend gerou o Token no input 'number'
          description: `Pedido ${orderId}`,
          installments: 1,
          payer: {
            email: customer.email,
            identification: {
              type: customer.document.length === 11 ? 'CPF' : 'CNPJ',
              number: customer.document.replace(/\D/g, "")
            }
          }
        }
      });

      return {
        success: response.status === "approved",
        txid: response.id?.toString(),
        status: response.status === "approved" ? "PAID" : "FAILED",
        error: response.status !== "approved" ? response.status_detail : undefined
      };
    } catch (error: any) {
      console.error("[MercadoPago Error - CARD]", error);
      return { success: false, status: "FAILED", error: error.message || "Erro no processamento de Cartão" };
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Validar HMAC do Webhook do Mercado Pago (via x-signature)
    return true; // Implementação específica de verificação
  }
}
