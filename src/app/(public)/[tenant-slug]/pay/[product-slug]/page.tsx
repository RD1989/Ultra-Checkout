import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ModernCheckout } from "@/components/features/checkout/modern-checkout";
import { MetaPixel } from "@/components/features/checkout/meta-pixel";

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ 
  params 
}: { 
  params: Promise<{ "tenant-slug": string; "product-slug": string }> 
}) {
  const resolvedParams = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: resolvedParams["tenant-slug"] }
  });

  if (!tenant) notFound();

  const product = await prisma.product.findUnique({
    where: { 
      tenantId_slug: { 
        tenantId: tenant.id, 
        slug: resolvedParams["product-slug"] 
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
