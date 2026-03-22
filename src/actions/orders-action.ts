"use server";

import { prisma } from "@/lib/prisma";
import { PaymentFactory } from "@/lib/payments/factory";
import { trackCapiEvent } from "@/lib/meta-capi-service";
import { revalidatePath } from "next/cache";

export async function createOrderAction(formData: any) {
  const { productId, customer, paymentMethod, tenantId, upsellId } = formData;

  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!tenant || !product) throw new Error("Configuração inválida.");

    // 1. Criar/Atualizar Cliente
    const dbCustomer = await prisma.customer.upsert({
      where: { tenantId_email: { tenantId, email: customer.email } },
      update: { phone: customer.phone, name: customer.name },
      create: { ...customer, tenantId }
    });

    // 2. Criar Pedido
    const order = await prisma.order.create({
      data: {
        tenantId,
        productId,
        customerId: dbCustomer.id,
        totalAmount: product.price,
        paymentMethod,
        status: "PENDING",
      }
    });

    // 3. Processar Pagamento Dinamicamente
    // Fazendo um cast temporário para (tenant as any) até que o cache de tipos do TypeScript 
    // do Next.js se alinhe completamente com o novo Prisma Schema gerado.
    const providerStr = (tenant as any).paymentProvider || "EFI";
    const conf = (tenant as any).paymentConfig || { clientId: tenant.efiClientId, clientSecret: tenant.efiClientSecret };

    const provider = PaymentFactory.getProvider(providerStr, conf);

    let paymentResult;
    if (paymentMethod === "PIX") {
      paymentResult = await provider.createPixCharge(order.id, Number(product.price), customer);
      await prisma.order.update({
        where: { id: order.id },
        data: { efiTransactionId: paymentResult.txid } // Podemos renomear efiTransactionId depois no banco se necessário
      });
    } else {
      // paymentResult = await provider.createCardCharge(...)
    }

    // 4. Rastreamento CAPI (Meta)
    if (tenant.facebookPixelId && tenant.facebookCapiToken) {
      await trackCapiEvent(
        tenant.facebookPixelId,
        tenant.facebookCapiToken,
        "Purchase",
        { em: customer.email, ph: customer.phone },
        { value: Number(product.price), currency: "BRL" }
      );
    }

    return { success: true, orderId: order.id, paymentResult };
  } catch (error: any) {
    console.error("Order Action Error:", error);
    return { success: false, error: error.message };
  }
}
