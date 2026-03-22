import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ModernCheckout } from "@/components/features/checkout/modern-checkout";
import { MetaPixel } from "@/components/features/checkout/meta-pixel";

export default async function CheckoutPage({ 
  params 
}: { 
  params: { "tenant-slug": string; "product-slug": string } 
}) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: params["tenant-slug"] }
  });

  if (!tenant) notFound();

  const product = await prisma.product.findUnique({
    where: { 
      tenantId_slug: { 
        tenantId: tenant.id, 
        slug: params["product-slug"] 
      } 
    },
    include: { orderBumps: { include: { bumpProduct: true } } }
  });

  if (!product) notFound();

  return (
    <>
      <MetaPixel pixelId={tenant.facebookPixelId || ""} />
      <ModernCheckout product={product} tenant={tenant} />
    </>
  );
}
