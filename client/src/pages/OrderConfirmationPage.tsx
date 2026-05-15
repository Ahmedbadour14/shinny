import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ShoppingBag, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLangStore } from '../store/languageStore'
import { formatPrice } from '../utils/helpers'

export default function OrderConfirmationPage() {
  const { t } = useTranslation()
  const { lang } = useLangStore()
  const { state } = useLocation()
  const order = state?.order

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="section-title mb-2">{t('confirmation.title')}</h1>
          <p className="text-navy/60 dark:text-cream/60 mb-8">{t('confirmation.subtitle')}</p>

          {order && (
            <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm text-left mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy/60 dark:text-cream/60">{t('confirmation.orderNumber')}</span>
                <span className="font-mono font-bold text-gold">{order.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy/60 dark:text-cream/60">{lang === 'ar' ? 'الاسم' : 'Customer'}</span>
                <span className="font-semibold text-navy dark:text-cream">{order.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy/60 dark:text-cream/60">{lang === 'ar' ? 'طريقة الدفع' : 'Payment'}</span>
                <span className="font-semibold text-navy dark:text-cream capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between border-t border-cream/30 dark:border-navy-lighter pt-3">
                <span className="font-semibold text-navy dark:text-cream">{t('cart.total')}</span>
                <span className="text-xl font-bold text-gold">{formatPrice(order.total, lang)}</span>
              </div>
            </div>
          )}

          <p className="text-sm text-navy/50 dark:text-cream/50 mb-8">
            {t('confirmation.email')} <span className="text-gold font-medium">{order?.email}</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="btn-primary flex items-center justify-center gap-2">
              <ShoppingBag size={18} /> {t('confirmation.continueShopping')}
            </Link>
            <Link to="/" className="btn-secondary flex items-center justify-center gap-2">
              <Package size={18} /> {lang === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
