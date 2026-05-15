import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Building2, Banknote, User, MapPin, Phone, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useCartStore } from '../store/cartStore'
import { useLangStore } from '../store/languageStore'
import { formatPrice } from '../utils/helpers'
import { CheckoutForm } from '../types'

const CITIES = ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Sharm El-Sheikh', 'Hurghada', 'Mansoura', 'Tanta', 'Zagazig', 'Other']

export default function CheckoutPage() {
  const { t } = useTranslation()
  const { lang } = useLangStore()
  const navigate = useNavigate()
  const { items, getTotal, getSubtotal, discount, promoCode, clearCart } = useCartStore()

  const [form, setForm] = useState<CheckoutForm>({
    customerName: '', email: '', phone: '', address: '', city: '', paymentMethod: 'cod',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})

  function validate() {
    const e: Partial<CheckoutForm> = {}
    if (!form.customerName.trim()) e.customerName = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.phone || form.phone.length < 10) e.phone = 'Valid phone required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city) e.city = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data: order } = await axios.post('/api/orders', {
        ...form,
        items,
        total: getTotal(),
        promoCode,
        discount,
      })

      if (form.paymentMethod === 'paymob') {
        const { data: payment } = await axios.post('/api/payment/paymob/init', {
          orderId: order.id,
          customerName: form.customerName,
          email: form.email,
          phone: form.phone,
          city: form.city,
          address: form.address,
          amount: getTotal(),
        })
        clearCart()
        navigate('/payment', { state: { method: 'paymob', iframeUrl: payment.iframeUrl, order } })
      } else if (form.paymentMethod === 'fawry') {
        const { data: fawry } = await axios.post('/api/payment/fawry/init', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          email: form.email,
          phone: form.phone,
          items: items.map(i => ({ name: i.product.name, price: i.product.price, quantity: i.quantity })),
          amount: getTotal(),
        })
        clearCart()
        navigate('/payment', { state: { method: 'fawry', fawryRef: fawry.referenceNumber, order } })
      } else {
        clearCart()
        navigate('/order-confirmation', { state: { order } })
      }
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  const total = getTotal()
  const subtotal = getSubtotal()

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">{t('checkout.title')}</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer info */}
            <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif font-semibold text-navy dark:text-cream text-lg mb-4 flex items-center gap-2">
                <User size={18} className="text-gold" /> {t('checkout.customerInfo')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-navy dark:text-cream mb-1 block">{t('checkout.name')}</label>
                  <input value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className={`input-field ${errors.customerName ? 'border-red-400' : ''}`} />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-navy dark:text-cream mb-1 block">{t('checkout.email')}</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-navy dark:text-cream mb-1 block">{t('checkout.phone')}</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="01XXXXXXXXX" className={`input-field ${errors.phone ? 'border-red-400' : ''}`} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif font-semibold text-navy dark:text-cream text-lg mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-gold" /> {t('checkout.shippingAddress')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-navy dark:text-cream mb-1 block">{t('checkout.address')}</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className={`input-field ${errors.address ? 'border-red-400' : ''}`} />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-navy dark:text-cream mb-1 block">{t('checkout.city')}</label>
                  <select value={form.city} onChange={e => setForm({...form, city: e.target.value})} className={`input-field ${errors.city ? 'border-red-400' : ''}`}>
                    <option value="">{lang === 'ar' ? 'اختر مدينة' : 'Select city'}</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif font-semibold text-navy dark:text-cream text-lg mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-gold" /> {t('checkout.paymentMethod')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'paymob', label: t('checkout.paymob'), icon: <CreditCard size={22} />, desc: 'Visa / Mastercard' },
                  { value: 'fawry', label: t('checkout.fawry'), icon: <Building2 size={22} />, desc: 'Pay at any Fawry outlet' },
                  { value: 'cod', label: t('checkout.cod'), icon: <Banknote size={22} />, desc: 'Pay on delivery' },
                ].map(method => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setForm({...form, paymentMethod: method.value as any})}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${form.paymentMethod === method.value ? 'border-gold bg-gold/5 text-gold' : 'border-cream dark:border-navy-lighter text-navy/60 dark:text-cream/60 hover:border-gold/50'}`}
                  >
                    {method.icon}
                    <span className="text-sm font-semibold">{method.label}</span>
                    <span className="text-xs opacity-70">{method.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-serif font-semibold text-navy dark:text-cream text-lg mb-4">{t('checkout.orderSummary')}</h2>
              <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <img src={item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-navy dark:text-cream truncate">{lang === 'ar' ? item.product.nameAr : item.product.name}</p>
                      <p className="text-xs text-navy/40 dark:text-cream/40">×{item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-gold">{formatPrice(item.product.price * item.quantity, lang)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream/30 dark:border-navy-lighter pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-navy/70 dark:text-cream/70">
                  <span>{t('cart.subtotal')}</span><span>{formatPrice(subtotal, lang)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Promo ({promoCode})</span><span>−{discount}%</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-navy dark:text-cream text-base pt-2 border-t border-cream/30 dark:border-navy-lighter">
                  <span>{t('cart.total')}</span>
                  <span className="text-gold text-lg">{formatPrice(total, lang)}</span>
                </div>
              </div>
              <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full mt-5 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? t('checkout.processing') : t('checkout.placeOrder')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
