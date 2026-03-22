"use server";

import { prisma } from "@/lib/prisma";

export async function captureLeadAction(data: { email: string; name?: string; phone?: string; tenantId: string; productId: string }) {
  try {
    const customer = await prisma.customer.upsert({
      where: { 
        tenantId_email: { 
          tenantId: data.tenantId, 
          email: data.email 
        } 
      },
      update: {
        name: data.name || undefined,
        phone: data.phone || undefined
      },
      create: {
        tenantId: data.tenantId,
        email: data.email,
        name: data.name || "Lead Pendente",
        document: "00000000000", // Placeholder para lead
        phone: data.phone || ""
      }
    });

    // Opcional: Criar log de abandono ou integrar com CRM externo
    return { success: true, customerId: customer.id };
  } catch (error) {
    return { success: false };
  }
}
