const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-ecommerce-key-123'

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
app.use('/uploads', express.static(uploadDir))

const processBase64Images = (body) => {
  const processString = (str) => {
    if (typeof str === 'string' && str.startsWith('data:image')) {
      try {
        const matches = str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        if (matches && matches.length === 3) {
          const ext = matches[1].split('/')[1] || 'png'
          const buffer = Buffer.from(matches[2], 'base64')
          const fileName = `upload_${Date.now()}_${Math.floor(Math.random()*10000)}.${ext}`
          fs.writeFileSync(path.join(uploadDir, fileName), buffer)
          return `http://localhost:3001/uploads/${fileName}`
        }
      } catch (err) {
        console.error('Failed to process base64 image', err)
      }
    }
    return str
  }

  const fields = ['img', 'heroImage', 'image', 'logo', 'bannerImage']
  for (const field of fields) {
    if (body[field]) {
      body[field] = processString(body[field])
    }
  }

  // Handle arrays that might be passed as JSON strings (like gallery and sliderImages)
  const arrayFields = ['gallery', 'sliderImages']
  for (const field of arrayFields) {
    if (body[field]) {
      let arr = []
      if (Array.isArray(body[field])) {
        arr = body[field]
      } else if (typeof body[field] === 'string') {
        try {
          arr = JSON.parse(body[field])
        } catch(e) {
          continue
        }
      }
      
      if (Array.isArray(arr)) {
        arr = arr.map(img => processString(img))
        body[field] = JSON.stringify(arr) // Prisma expects a string for these fields based on schema
      }
    }
  }
}


// === Auth Middleware ===
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// === Auth Routes ===
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: 'customer' }
    })
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ user: { id: user.id, email: user.email, role: user.role }, token })
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' })
  }
})

// Seed Hero Stats
async function seedHeroStats() {
  try {
    const count = await prisma.heroStat.count()
    if (count === 0) {
      await prisma.heroStat.createMany({
        data: [
          { id: '1', value: '4,200+', label: 'Enterprise Clients' },
          { id: '2', value: '99.99%', label: 'Uptime SLA' },
          { id: '3', value: '15min', label: 'Avg Response Time' },
          { id: '4', value: '0-Day', label: 'Threat Detection' }
        ]
      })
    }
  } catch (error) {
    console.error('Failed to seed hero stats', error)
  }
}
seedHeroStats()

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })
    
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' })
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ user: { id: user.id, email: user.email, role: user.role }, token })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    res.json({ user: { id: user.id, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// === CRUD Factory Helper ===
// Generates basic GET, POST, PUT, DELETE for any model
const createCrudRoutes = (modelName, path) => {
  app.get(path, async (req, res) => {
    const items = await prisma[modelName].findMany()
    res.json(items)
  })
  
  app.post(path, async (req, res) => {
    processBase64Images(req.body)
    const item = await prisma[modelName].create({ data: req.body })
    res.json(item)
  })
  
  app.put(`${path}/:id`, async (req, res) => {
    let id = req.params.id
    if (modelName === 'product') id = parseInt(id) // product uses integer ID
    processBase64Images(req.body)
    const item = await prisma[modelName].update({ where: { id }, data: req.body })
    res.json(item)
  })
  
  app.delete(`${path}/:id`, async (req, res) => {
    let id = req.params.id
    if (modelName === 'product') id = parseInt(id)
    await prisma[modelName].delete({ where: { id } })
    res.json({ success: true })
  })
}

// === Catalog Routes ===
createCrudRoutes('category', '/api/categories')
createCrudRoutes('brand', '/api/brands')
createCrudRoutes('product', '/api/products')
createCrudRoutes('bundle', '/api/bundles')
createCrudRoutes('trustedOrg', '/api/trusted_orgs')
createCrudRoutes('heroStat', '/api/hero_stats')
createCrudRoutes('specTemplate', '/api/spec_templates')

// === User Specific Data Routes (Cart, Wishlist, Address) ===

// Cart
app.get('/api/cart_items', authenticateToken, async (req, res) => {
  const items = await prisma.cartItem.findMany({ where: { userId: req.user.id } })
  res.json(items)
})
app.post('/api/cart_items', authenticateToken, async (req, res) => {
  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: req.user.id, productId: req.body.productId } },
    update: { quantity: req.body.quantity },
    create: { userId: req.user.id, productId: req.body.productId, quantity: req.body.quantity }
  })
  res.json(item)
})
app.put('/api/cart_items/:productId', authenticateToken, async (req, res) => {
  const item = await prisma.cartItem.update({
    where: { userId_productId: { userId: req.user.id, productId: parseInt(req.params.productId) } },
    data: { quantity: req.body.quantity }
  })
  res.json(item)
})
app.delete('/api/cart_items/:productId', authenticateToken, async (req, res) => {
  await prisma.cartItem.delete({
    where: { userId_productId: { userId: req.user.id, productId: parseInt(req.params.productId) } }
  })
  res.json({ success: true })
})
app.delete('/api/cart_items', authenticateToken, async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } })
  res.json({ success: true })
})

// Wishlist
app.get('/api/wishlists', authenticateToken, async (req, res) => {
  const items = await prisma.wishlistItem.findMany({ where: { userId: req.user.id } })
  res.json(items)
})
app.post('/api/wishlists', authenticateToken, async (req, res) => {
  const item = await prisma.wishlistItem.create({
    data: { userId: req.user.id, productId: req.body.productId }
  })
  res.json(item)
})
app.delete('/api/wishlists/:productId', authenticateToken, async (req, res) => {
  await prisma.wishlistItem.delete({
    where: { userId_productId: { userId: req.user.id, productId: parseInt(req.params.productId) } }
  })
  res.json({ success: true })
})

// Addresses
app.get('/api/addresses', authenticateToken, async (req, res) => {
  const items = await prisma.address.findMany({ where: { userId: req.user.id } })
  res.json(items)
})
app.post('/api/addresses', authenticateToken, async (req, res) => {
  const item = await prisma.address.create({ data: { ...req.body, userId: req.user.id } })
  res.json(item)
})
app.put('/api/addresses/:id', authenticateToken, async (req, res) => {
  const item = await prisma.address.update({ where: { id: req.params.id }, data: req.body })
  res.json(item)
})
app.delete('/api/addresses/:id', authenticateToken, async (req, res) => {
  await prisma.address.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

// Orders & Checkout
app.post('/api/checkout', authenticateToken, async (req, res) => {
  try {
    const { paymentMethod, shippingAddress, contactName } = req.body
    
    // 1. Get user cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    })
    
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    // 2. Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.product.price), 0)
    
    // 3. Create Order & OrderItems in transaction
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.id,
        totalAmount,
        paymentMethod,
        shippingAddress: JSON.stringify(shippingAddress),
        contactName,
        orderItems: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    })

    // 4. Clear cart
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } })

    res.json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

app.get('/api/orders', authenticateToken, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json(orders)
})

app.get('/api/admin/orders', authenticateToken, async (req, res) => {
  // TODO: Verify admin role
  const orders = await prisma.order.findMany({
    include: { 
      user: { select: { email: true } },
      orderItems: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  res.json(orders)
})

app.put('/api/admin/orders/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status }
  })
  res.json(order)
})

app.get('/api/admin/settings', async (req, res) => {
  try {
    let settings = await prisma.globalSettings.findUnique({ where: { id: 'default' } })
    if (!settings) {
      settings = await prisma.globalSettings.create({ data: { id: 'default' } })
    }
    res.json(settings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to get settings' })
  }
})

app.put('/api/admin/settings', authenticateToken, async (req, res) => {
  try {
    processBase64Images(req.body)
    const { orgName, timezone, language, dateFormat, currency, bannerImage, bannerLabel, bannerTitle, bannerSubtext, sliderImages } = req.body
    console.log('PUT settings:', req.body)
    const settings = await prisma.globalSettings.upsert({
      where: { id: 'default' },
      update: { orgName, timezone, language, dateFormat, currency, bannerImage, bannerLabel, bannerTitle, bannerSubtext, sliderImages },
      create: { id: 'default', orgName, timezone, language, dateFormat, currency, bannerImage, bannerLabel, bannerTitle, bannerSubtext, sliderImages }
    })
    res.json(settings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update settings' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
