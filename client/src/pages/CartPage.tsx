import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, Tag, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useCartStore } from '../store/cartStore'
import { useLangStore } from '../store/languageStore'
import { formatPrice } from '../utils/helpers'

export default function CartPage() {
  const { t } = useTranslation()
  const { lang } = useLangStore()
  const { items, updateQty, removeItem, getSubtotal, getTotal, discount, promoCode, applyPromo, removePromo } = useCartStore()
  const [code, setCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  async function handleApplyPromo() {
    if (!code) return
    setPromoLoading(true); setPromoError('')
    try {
      const { data } = await axios.post('/api/promo/validate', { code })
      applyPromo(data.code, data.discount)
    } catch {
      setPromoError(lang === 'ar' ? 'كود غير صالح أو منتهي الصلاحية' : 'Invalid or expired promo code')
    } finally { setPromoLoading(false) }
  }

  if (items.length === 0) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag size={64} className="text-cream dark:text-navy-lighter mx-auto mb-4" />
        <h1 className="text-2xl font-serif font-bold text-navy dark:text-cream mb-2">{t('cart.empty')}</h1>
        <Link to="/shop" className="btn-primary inline-flex mt-4">{t('cart.startShopping')}</Link>
      </div>
    </div>
  )

  const subtotal = getSubtotal()
  const total = getTotal()
  const discountAmt = subtotal - total

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <motion.div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 bg-white dark:bg-navy-light rounded-2xl p-4 shadow-sm"
              >
                <Link to={`/product/${item.product.id}`}>
                  <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-serif font-semibold text-navy dark:text-cream hover:text-gold transition-colors">{lang === 'ar' ? item.product.nameAr : item.product.name}</h3>
                  </Link>
                  <p className="text-xs text-navy/50 dark:text-cream/50 mt-0.5">{item.selectedColor} · {item.selectedSize}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-cream/30 dark:bg-navy rounded-full px-2 py-1">
                      <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gold hover:text-white transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-navy dark:text-cream">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gold hover:text-white transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-gold font-bold">{formatPrice(item.product.price * item.quantity, lang)}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.product.id)} className="text-navy/30 dark:text-cream/30 hover:text-red-500 transition-colors self-start">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-serif font-semibold text-navy dark:text-cream text-lg mb-5">{t('checkout.orderSummary')}</h2>

              {/* Promo */}
              <div className="mb-5">
                <label className="text-sm font-medium text-navy dark:text-cream flex items-center gap-1.5 mb-2">
                  <Tag size={14} className="text-gold" /> {t('cart.promo')}
                </label>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl px-3 py-2 text-sm font-semibold">
                    <span>{promoCode} (−{discount}%)</span>
                    <button onClick={removePromo}><X size={14} /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="SHINNY10" className="input-field flex-1 py-2 text-sm" />
                    <button onClick={handleApplyPromo} disabled={promoLoading} className="btn-primary py-2 px-4 text-sm">{t('cart.apply')}</button>
                  </div>
                )}
                {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
              </div>

              <div className="space-y-3 text-sm border-t border-cream/30 dark:border-navy-lighter pt-4">
                <div className="flex justify-between text-navy/70 dark:text-cream/70">
                  <span>{t('cart.subtotal')}</span><span>{formatPrice(subtotal, lang)}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                    <span>{t('cart.discount')} (−{discount}%)</span><span>−{formatPrice(discountAmt, lang)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-navy dark:text-cream text-base border-t border-cream/30 dark:border-navy-lighter pt-3">
                  <span>{t('cart.total')}</span>
                  <span className="text-gold text-xl">{formatPrice(total, lang)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center block mt-5">{t('cart.checkout')}</Link>
              <Link to="/shop" className="block text-center mt-3 text-sm text-navy/50 dark:text-cream/50 hover:text-gold">{t('cart.continueShopping')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
