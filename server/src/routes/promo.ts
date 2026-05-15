import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// POST /api/promo/validate
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { code } = req.body
    if (!code) return res.status(400).json({ error: 'Code is required' })

    const promo = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } })

    if (!promo || !promo.active) {
      return res.status(404).json({ error: 'Invalid or expired promo code' })
    }

    res.json({ discount: promo.discount, code: promo.code })
  } catch (err) {
    res.status(500).json({ error: 'Failed to validate promo code' })
  }
})

export default router
