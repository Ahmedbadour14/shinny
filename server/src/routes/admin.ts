import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'shinny_secret'

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

// POST /api/admin/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, email: admin.email })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// GET /api/admin/stats
router.get('/stats', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const [totalOrders, products, orders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({ select: { total: true, status: true, createdAt: true } }),
    ])

    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const confirmedOrders = orders.filter(o => o.status === 'confirmed').length

    // Monthly revenue (last 6 months)
    const now = new Date()
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = d.toLocaleString('default', { month: 'short' })
      const revenue = orders
        .filter(o => {
          const od = new Date(o.createdAt)
          return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear()
        })
        .reduce((s, o) => s + o.total, 0)
      return { month, revenue }
    }).reverse()

    res.json({ totalOrders, totalRevenue, products, pendingOrders, confirmedOrders, monthlyRevenue })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// GET /api/admin/products
router.get('/products', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(products.map(p => ({
      ...p,
      images: JSON.parse(p.images),
      colors: JSON.parse(p.colors),
      sizes: JSON.parse(p.sizes),
    })))
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// POST /api/admin/products
router.post('/products', authMiddleware, upload.array('images', 5), async (req: Request, res: Response) => {
  try {
    const { name, nameAr, description, descriptionAr, price, category, colors, sizes, stock, featured, imageUrls } = req.body

    const uploadedImages = (req.files as Express.Multer.File[] || []).map(f => `/uploads/${f.filename}`)
    const urlImages = imageUrls ? JSON.parse(imageUrls) : []
    const allImages = [...urlImages, ...uploadedImages]

    const product = await prisma.product.create({
      data: {
        name, nameAr, description, descriptionAr,
        price: Number(price),
        category,
        colors: typeof colors === 'string' ? colors : JSON.stringify(colors),
        sizes: typeof sizes === 'string' ? sizes : JSON.stringify(sizes),
        stock: Number(stock) || 100,
        featured: featured === 'true' || featured === true,
        images: JSON.stringify(allImages),
      },
    })
    res.status(201).json({ ...product, images: JSON.parse(product.images), colors: JSON.parse(product.colors), sizes: JSON.parse(product.sizes) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// PUT /api/admin/products/:id
router.put('/products/:id', authMiddleware, upload.array('images', 5), async (req: Request, res: Response) => {
  try {
    const { name, nameAr, description, descriptionAr, price, category, colors, sizes, stock, featured, imageUrls } = req.body
    const uploadedImages = (req.files as Express.Multer.File[] || []).map(f => `/uploads/${f.filename}`)
    const urlImages = imageUrls ? JSON.parse(imageUrls) : []
    const allImages = [...urlImages, ...uploadedImages]

    const data: any = { name, nameAr, description, descriptionAr, price: Number(price), category, stock: Number(stock), featured: featured === 'true' || featured === true }
    if (colors) data.colors = typeof colors === 'string' ? colors : JSON.stringify(colors)
    if (sizes) data.sizes = typeof sizes === 'string' ? sizes : JSON.stringify(sizes)
    if (allImages.length) data.images = JSON.stringify(allImages)

    const product = await prisma.product.update({ where: { id: Number(req.params.id) }, data })
    res.json({ ...product, images: JSON.parse(product.images), colors: JSON.parse(product.colors), sizes: JSON.parse(product.sizes) })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// DELETE /api/admin/products/:id
router.delete('/products/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// GET /api/admin/orders
router.get('/orders', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query
    const where = status && status !== 'all' ? { status: String(status) } : {}
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ])
    res.json({ orders: orders.map(o => ({ ...o, items: JSON.parse(o.items) })), total, page: Number(page) })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// PUT /api/admin/orders/:id
router.put('/orders/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, paymentStatus } = req.body
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
    })
    res.json({ ...order, items: JSON.parse(order.items) })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' })
  }
})

export default router
