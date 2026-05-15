import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '../store/cartStore'
import { useLangStore } from '../store/languageStore'
import { formatPrice } from '../utils/helpers'

// Self-contained CartDrawer triggered by a cart icon in the navbar area
// This version is rendered globally from App.tsx with no props
export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { lang } = useLangStore()
  const { items, updateQty, removeItem, getSubtotal, getTotal, discount, promoCode } = useCartStore()

  // Expose toggle globally via custom event
  if (typeof window !== 'undefined') {
    (window as any).__openCart = () => setOpen(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-40" />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-navy z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-cream/30 dark:border-navy-lighter">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-gold" />
                <h2 className="font-serif text-lg font-semibold text-navy dark:text-cream">{t('cart.title')}</h2>
                <span className="badge bg-gold/10 text-gold text-xs">{items.length}</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-cream/50 dark:hover:bg-navy-light transition-colors">
                <X size={18} className="text-navy dark:text-cream" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-cream dark:text-navy-lighter" />
                  <p className="text-navy/50 dark:text-cream/50">{t('cart.empty')}</p>
                  <Link to="/shop" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 px-5">{t('cart.startShopping')}</Link>
                </div>
              ) : (
                items.map(item => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3 bg-cream/20 dark:bg-navy-light rounded-xl p-3">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy dark:text-cream truncate">{lang === 'ar' ? item.product.nameAr : item.product.name}</p>
                      <p className="text-xs text-navy/50 dark:text-cream/50">{item.selectedColor} · {item.selectedSize}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-white dark:bg-navy flex items-center justify-center hover:bg-gold hover:text-white transition-colors shadow-sm">
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-navy dark:text-cream">{item.quantity}</span>
                          <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-white dark:bg-navy flex items-center justify-center hover:bg-gold hover:text-white transition-colors shadow-sm">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-gold font-bold text-sm">{formatPrice(item.product.price * item.quantity, lang)}</span>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="text-navy/30 dark:text-cream/30 hover:text-red-500 transition-colors self-start mt-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-cream/30 dark:border-navy-lighter p-4 space-y-3">
                <div className="flex justify-between text-sm text-navy/70 dark:text-cream/70">
                  <span>{t('cart.subtotal')}</span><span>{formatPrice(getSubtotal(), lang)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>{t('cart.discount')} ({promoCode})</span><span>-{discount}%</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-navy dark:text-cream">
                  <span>{t('cart.total')}</span>
                  <span className="text-gold text-lg">{formatPrice(getTotal(), lang)}</span>
                </div>
                <Link to="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full text-center block text-sm">{t('cart.checkout')}</Link>
                <Link to="/cart" onClick={() => setOpen(false)} className="block text-center text-sm text-navy/60 dark:text-cream/60 hover:text-gold">{t('cart.continueShopping')}</Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
