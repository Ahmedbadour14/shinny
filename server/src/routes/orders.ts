import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

function generateOrderNumber(): string {
  return 'SHN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
}

// POST /api/orders
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, email, phone, address, city, paymentMethod, items, total, promoCode, discount } = req.body

    if (!customerName || !email || !phone || !address || !city || !paymentMethod || !items) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        email,
        phone,
        address,
        city,
        paymentMethod,
        items: JSON.stringify(items),
        total: Number(total),
        promoCode: promoCode || null,
        discount: Number(discount) || 0,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'awaiting',
        status: 'pending',
      },
    })

    res.status(201).json({ ...order, items: JSON.parse(order.items) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// GET /api/orders/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: isNaN(Number(req.params.id)) ? -1 : Number(req.params.id) },
          { orderNumber: req.params.id },
        ],
      },
    })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json({ ...order, items: JSON.parse(order.items) })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

export default router
