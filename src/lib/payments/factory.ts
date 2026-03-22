import { IPaymentProvider, PaymentCustomer, PaymentCardDetails, CreateChargeResult } from "./adapter";
import { EfiService } from "../efi-api-service";
import { MercadoPagoAdapter } from "./providers/mercadopago";
import { StripeAdapter } from "./providers/stripe";
import { PushinPayAdapter } from "./providers/pushinpay";
import { HypercashAdapter } from "./providers/hypercash";

export type SupportedProviders = "EFI" | "MERCADOPAGO" | "STRIPE" | "PUSHINPAY" | "HYPERCASH";

export class PaymentFactory {
  static getProvider(providerName: string, config: any): IPaymentProvider {
    switch (providerName as SupportedProviders) {
      case "EFI":
        if (!config.clientId || !config.clientSecret) {
          throw new Error("Credenciais Efí incompletas");
        }
        // Atualmente EfiService possui seus métodos próprios, precisaríamos criar 
        // um EfiAdapter que implementa IPaymentProvider para 100% de consistência.
        // Simulando a ponte:
        const efiService = new EfiService(config);
        return {
          createPixCharge: async (orderId: string, amount: number, customer: any) => {
             // O EfiService antigo espera { nome, cpf }. O padrão novo é { name, document }
             const efiCustomer = { nome: customer.name, cpf: customer.document };
             const result = await efiService.createPixCharge(orderId, amount, efiCustomer as any);
             return {
                success: true,
                txid: result.txid,
                qrCodeBase64: result.qrCodeBase64,
                pixCopiaECola: result.pixCopiaECola,
                status: "PENDING"
             };
          },
          createCardCharge: async () => ({ success: false, status: "FAILED", error: "Não implementado no adapter EFÍ ainda" }),
          verifyWebhookSignature: () => true
        };

      case "MERCADOPAGO":
        if (!config.accessToken) throw new Error("AccessToken do Mercado Pago ausente");
        return new MercadoPagoAdapter(config.accessToken);
        
      case "STRIPE":
        if (!config.secretKey) throw new Error("Stripe Secret Key ausente");
        return new StripeAdapter(config.secretKey);

      case "PUSHINPAY":
        if (!config.apiKey) throw new Error("PushinPay API Key ausente");
        return new PushinPayAdapter(config.apiKey);

      case "HYPERCASH":
        if (!config.secretKey) throw new Error("Hypercash Secret Key ausente");
        return new HypercashAdapter(config.secretKey);

      default:
        throw new Error(`Provedor de pagamento '${providerName}' não suportado.`);
    }
  }
}

// Dummy Provider para provedores mapeados mas ainda não codificados em detalhe
class DummyProvider implements IPaymentProvider {
  constructor(private name: string) {}

  async createPixCharge(orderId: string, amount: number, customer: PaymentCustomer): Promise<CreateChargeResult> {
    console.log(`[${this.name}] Criando PIX de R$${amount} para Pedido ${orderId}`);
    return {
      success: true,
      txid: `dummy_txid_${Date.now()}`,
      qrCodeBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      pixCopiaECola: `00020101021226...${this.name}...`,
      status: "PENDING" as const
    };
  }

  async createCardCharge(orderId: string, amount: number, customer: PaymentCustomer, card: PaymentCardDetails): Promise<CreateChargeResult> {
    console.log(`[${this.name}] Processando CARTÃO de R$${amount}`);
    return {
       success: true,
       txid: `dummy_cc_${Date.now()}`,
       status: "PAID" as const
    };
  }

  verifyWebhookSignature() { return true; }
}
