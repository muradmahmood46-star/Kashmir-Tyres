const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')
  
  // Create admin user
  const adminEmail = 'admin'
  const adminPassword = await bcrypt.hash('admin786786', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    },
  })
  
  console.log(`Admin user created/verified: ${admin.email}`)
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
