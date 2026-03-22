"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertProductAction(data: any) {
  const { id, tenantId, ...rest } = data;

  try {
    const product = id 
      ? await prisma.product.update({ where: { id }, data: rest })
      : await prisma.product.create({ data: { ...rest, tenantId } });

    await prisma.auditLog.create({
      data: {
        tenantId,
        userId: "system", // Em prod, pegar do session.user.id
        action: id ? "UPDATE_PRODUCT" : "CREATE_PRODUCT",
        resource: product.id,
        details: rest
      }
    });

    revalidatePath("/dashboard/products");
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
