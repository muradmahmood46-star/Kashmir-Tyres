
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  console.log('Seeding Supabase DB...')
  
  // 1. Settings
  await prisma.globalSettings.upsert({
    where: { id: 'default' },
    update: { orgName: 'Kashmir Tyres' },
    create: {
      id: 'default',
      orgName: 'Kashmir Tyres',
      bannerLabel: 'GENERAL SALE',
      bannerTitle: 'Save $6,000 on Complete Car Care Combo Bundle',
      bannerSubtext: 'Explore Deals'
    }
  })
  
  // 2. Admin User
  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@kashmirtyres.com' },
    update: { role: 'ADMIN', password: passwordHash },
    create: {
      email: 'admin@kashmirtyres.com',
      password: passwordHash,
      role: 'ADMIN'
    }
  })
  
  console.log('Done seeding.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
