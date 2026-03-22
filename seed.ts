const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'ultra' },
    update: {},
    create: {
      name: 'Ultra Admin',
      slug: 'ultra',
      efiSandbox: true,
      primaryColor: '#2563eb'
    }
  })

  const product = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      name: 'Masterclass Ultra SaaS',
      slug: 'masterclass',
      price: 197.00,
      description: 'Aprenda a construir checkouts de alta performance.',
      active: true
    }
  })

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
