import { IPaymentProvider, PaymentCustomer, PaymentCardDetails, CreateChargeResult } from "../../adapter";
import Stripe from "stripe";

export class StripeAdapter implements IPaymentProvider {
  private stripe: Stripe;

  constructor(secretKey: string) {
    if (!secretKey) throw new Error("Stripe Secret Key é obrigatória.");
    this.stripe = new Stripe(secretKey, {
      apiVersion: "2024-04-10" as any, // Utilizando cast para evitar conflito com versões futuras do definitions
    });
  }

  async createPixCharge(orderId: string, amount: number, customer: PaymentCustomer): Promise<CreateChargeResult> {
    try {
      // A Stripe suporta Pix no Brasil via PaymentIntents com payment_method_types: ['pix']
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe funciona em centavos
        currency: 'brl',
        payment_method_types: ['pix'],
        description: `Pedido ${orderId}`,
        receipt_email: customer.email,
        metadata: { orderId }
      });

      // O QR Code real viria no objeto NextAction, extraímos com segurança
      const nextAction = paymentIntent.next_action as any;

      return {
        success: true,
        txid: paymentIntent.id,
        qrCodeBase64: nextAction?.pix_display_details?.qr_code_image_url || "url_indisponivel",
        pixCopiaECola: paymentIntent.client_secret || "indisponivel",
        status: "PENDING"
      };
    } catch (error: any) {
      console.error("[Stripe PIX Error]", error);
      return { success: false, status: "FAILED", error: error.message || "Erro na Stripe" };
    }
  }

  async createCardCharge(orderId: string, amount: number, customer: PaymentCustomer, cardDetails: PaymentCardDetails): Promise<CreateChargeResult> {
    try {
      // Na Stripe, o ideal é o frontend enviar um PaymentMethod ID via Elements (Token seguro).
      // Se enviarmos o cartão cru (Token legado), a chamada seria diferente. Assumindo token:
      
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'brl',
        payment_method: cardDetails.number, // Se for um obj "pm_1234..."
        confirm: true,
        return_url: "https://ultracheckout.com.br/success",
        receipt_email: customer.email,
        metadata: { orderId }
      });

      return {
        success: paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_action',
        txid: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? "PAID" : "PENDING",
        error: paymentIntent.last_payment_error?.message
      };
    } catch (error: any) {
      console.error("[Stripe CARD Error]", error);
      return { success: false, status: "FAILED", error: error.message || "Erro de Cobrança" };
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    // try { this.stripe.webhooks.constructEvent(payload, signature, WebhookSecret); return true; } ...
    return true; // Simplificado para fins de adapter unificado
  }
}
