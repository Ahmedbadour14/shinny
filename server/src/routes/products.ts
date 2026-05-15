import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, color, minPrice, maxPrice, search, sort, featured } = req.query

    let products = await prisma.product.findMany()

    // Filter by category
    if (category && category !== 'All') {
      products = products.filter(p => p.category === category)
    }

    // Filter by color
    if (color) {
      products = products.filter(p => {
        const colors: string[] = JSON.parse(p.colors)
        return colors.some(c => c.toLowerCase() === (color as string).toLowerCase())
      })
    }

    // Filter by price
    if (minPrice) products = products.filter(p => p.price >= Number(minPrice))
    if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice))

    // Filter featured
    if (featured === 'true') products = products.filter(p => p.featured)

    // Search
    if (search) {
      const q = (search as string).toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nameAr.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }

    // Sort
    switch (sort) {
      case 'price_asc': products.sort((a, b) => a.price - b.price); break
      case 'price_desc': products.sort((a, b) => b.price - a.price); break
      case 'newest': products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      default: break
    }

    // Parse JSON strings
    const parsed = products.map(p => ({
      ...p,
      images: JSON.parse(p.images),
      colors: JSON.parse(p.colors),
      sizes: JSON.parse(p.sizes),
    }))

    res.json(parsed)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) } })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json({
      ...product,
      images: JSON.parse(product.images),
      colors: JSON.parse(product.colors),
      sizes: JSON.parse(product.sizes),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

export default router
