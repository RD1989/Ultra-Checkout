/**
 * EFI CORE SERVICE (STRICT MODE - ZERO SDK)
 * Camada de integração direta com os endpoints da Efí/Gerencianet via HTTP.
 */

interface EfiConfig {
  clientId: string;
  clientSecret: string;
  sandbox: boolean;
  certificateP12?: string;
}

export class EfiService {
  private pixUrl: string;
  private chargeUrl: string;
  private authUrl: string;
  private token: { value: string; expiresAt: number } | null = null;

  constructor(private config: EfiConfig) {
    this.pixUrl = config.sandbox 
      ? 'https://pix-h.api.efipay.com.br' 
      : 'https://pix.api.efipay.com.br';
    
    this.chargeUrl = config.sandbox
      ? 'https://sandbox.gerencianet.com.br'
      : 'https://api.gerencianet.com.br';
    
    this.authUrl = `${this.pixUrl}/oauth/token`;
  }

  private async getAccessToken(): Promise<string> {
    if (this.token && this.token.expiresAt > Date.now()) {
      return this.token.value;
    }

    const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

    const response = await fetch(this.authUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grant_type: 'client_credentials' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Efí Auth Error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    this.token = {
      value: data.access_token,
      expiresAt: Date.now() + (data.expires_in * 1000) - 60000,
    };

    return this.token.value;
  }

  async createPixCharge(orderId: string, amount: number, customer: { nome: string; cpf: string }) {
    const token = await this.getAccessToken();
    const body = {
      calendario: { expiracao: 3600 },
      devedor: { cpf: customer.cpf.replace(/\D/g, ''), nome: customer.nome },
      valor: { original: amount.toFixed(2) },
      chave: process.env.EFI_PIX_KEY,
      solicitacaoPagador: `Pedido #${orderId} no Ultra Checkout`
    };

    const response = await fetch(`${this.pixUrl}/v2/cob`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Erro ao criar cobrança Pix");
    const charge = await response.json();
    const qrCodeData = await this.getQRCode(charge.loc.id);

    return {
      txid: charge.txid,
      pixCopiaECola: qrCodeData.qrcode,
      qrCodeBase64: qrCodeData.imagemQrcode,
    };
  }

  private async getQRCode(locId: number) {
    const token = await this.getAccessToken();
    const response = await fetch(`${this.pixUrl}/v2/loc/${locId}/qrcode`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await response.json();
  }

  async createCardCharge(orderId: string, amount: number, customer: any, paymentToken: string, installments: number = 1) {
    const token = await this.getAccessToken();
    const body = {
      items: [{ name: "Compra no Ultra Checkout", value: Math.round(amount * 100), amount: 1 }],
      payment: {
        credit_card: {
          installments,
          payment_token: paymentToken,
          billing_address: {
            street: customer.street || "Endereço",
            number: customer.number || "0",
            neighborhood: customer.neighborhood || "Bairro",
            zipcode: customer.zipcode?.replace(/\D/g, "") || "00000000",
            city: customer.city || "Cidade",
            state: customer.state || "SP"
          },
          customer: {
            name: customer.nome,
            email: customer.email,
            cpf: customer.cpf.replace(/\D/g, ""),
            phone_number: customer.phone.replace(/\D/g, "")
          }
        }
      }
    };

    const response = await fetch(`${this.chargeUrl}/v1/charge/one-step`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Erro ao processar cartão");
    return await response.json();
  }
}
