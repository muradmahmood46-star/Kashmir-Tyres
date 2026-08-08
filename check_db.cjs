const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const settings = await prisma.globalSettings.findUnique({ where: { id: 'default' } })
  console.log('bannerImage in DB:', settings.bannerImage.substring(0, 100))
}
main().catch(console.error).finally(() => prisma.$disconnect())
