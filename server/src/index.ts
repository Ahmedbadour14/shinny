import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

import productsRouter from './routes/products'
import ordersRouter from './routes/orders'
import paymentRouter from './routes/payment'
import promoRouter from './routes/promo'
import adminRouter from './routes/admin'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: [
    'https://shinny-chi.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/promo', promoRouter)
app.use('/api/admin', adminRouter)

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.listen(PORT, () => {
  console.log(`🚀 Shinny server running on http://localhost:${PORT}`)
})

export default app
