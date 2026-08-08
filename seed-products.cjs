const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding dummy products...')
  
  const category = await prisma.category.create({
    data: { name: 'Tyres', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&q=80' }
  })
  
  const brand = await prisma.brand.create({
    data: { name: 'Michelin', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Michelin_logo.svg' }
  })

  await prisma.product.create({
    data: {
      name: 'Michelin Pilot Sport 4S',
      description: 'Ultra-high performance sport tyre.',
      price: 299.99,
      images: ['https://images.unsplash.com/photo-1598978250005-eb38122d64f0?w=500&q=80'],
      categoryId: category.id,
      brandId: brand.id,
      stock: 10,
      isPublished: true,
      sku: 'MIC-PS4S-01'
    }
  })

  console.log('Done.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
