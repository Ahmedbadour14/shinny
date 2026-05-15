import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getAuthToken, createOrder, getPaymentKey, getIframeUrl } from '../services/paymobService'
import { createFawryCharge } from '../services/fawryService'

const router = Router()
const prisma = new PrismaClient()

// POST /api/payment/paymob/init
router.post('/paymob/init', async (req: Request, res: Response) => {
  try {
    const { orderId, customerName, email, phone, city, address, amount } = req.body

    const amountCents = Math.round(Number(amount) * 100)
    const [firstName, ...lastParts] = customerName.split(' ')
    const lastName = lastParts.join(' ') || 'N/A'

    const authToken = await getAuthToken()
    const paymobOrderId = await createOrder(authToken, amountCents)
    const paymentKey = await getPaymentKey(authToken, paymobOrderId, amountCents, {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
      city,
      country: 'EG',
      street: address,
      floor: 'N/A',
      apartment: 'N/A',
      building: 'N/A',
      postal_code: 'N/A',
      shipping_method: 'PKG',
      state: city,
    })

    const iframeUrl = getIframeUrl(paymentKey)

    // Update order with paymob token
    if (orderId) {
      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { paymobToken: paymentKey },
      })
    }

    res.json({ iframeUrl, paymentKey })
  } catch (err: any) {
    console.error('Paymob error:', err.message)
    res.status(500).json({ error: 'Failed to initialize Paymob payment' })
  }
})

// POST /api/payment/paymob/webhook
router.post('/paymob/webhook', async (req: Request, res: Response) => {
  try {
    const { obj } = req.body
    if (obj && obj.success === true) {
      const token = obj.payment_key_claims?.billing_data?.extra?.orderId
      if (token) {
        await prisma.order.updateMany({
          where: { paymobToken: token },
          data: { paymentStatus: 'paid', status: 'confirmed' },
        })
      }
    }
    res.json({ received: true })
  } catch (err) {
    res.status(500).json({ error: 'Webhook error' })
  }
})

// POST /api/payment/fawry/init
router.post('/fawry/init', async (req: Request, res: Response) => {
  try {
    const { orderId, orderNumber, email, phone, items, amount } = req.body

    const result = await createFawryCharge(
      orderNumber || `SHN-${Date.now()}`,
      email,
      phone,
      items.map((item: any, i: number) => ({
        itemId: `ITEM-${i + 1}`,
        description: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      Number(amount)
    )

    const fawryRef = result.referenceNumber || result.referenceNumber

    if (orderId) {
      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { fawryRef: String(fawryRef), paymentStatus: 'awaiting' },
      })
    }

    res.json({ referenceNumber: fawryRef, statusCode: result.statusCode })
  } catch (err: any) {
    console.error('Fawry error:', err.message)
    res.status(500).json({ error: 'Failed to initialize Fawry payment' })
  }
})

export default router
