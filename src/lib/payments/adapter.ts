export interface PaymentCustomer {
  name: string;
  email: string;
  document: string;
  phone: string;
}

export interface PaymentCardDetails {
  number: string;
  cvv: string;
  expirationMonth: string;
  expirationYear: string;
  holderName: string;
}

export interface CreateChargeResult {
  success: boolean;
  txid?: string;
  qrCodeBase64?: string;
  pixCopiaECola?: string;
  status: "PENDING" | "PAID" | "FAILED" | "AUTHORIZED";
  error?: string;
}

export interface IPaymentProvider {
  createPixCharge(orderId: string, amount: number, customer: PaymentCustomer): Promise<CreateChargeResult>;
  createCardCharge(orderId: string, amount: number, customer: PaymentCustomer, cardDetails: PaymentCardDetails): Promise<CreateChargeResult>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}
