import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Building2, Banknote, Copy, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export default function PaymentPage() {
  const { t } = useTranslation()
  const { state } = useLocation()
  const [copied, setCopied] = useState(false)

  const { method, iframeUrl, fawryRef, order } = state || {}

  function copyRef() {
    if (fawryRef) { navigator.clipboard.writeText(fawryRef); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  if (method === 'paymob' && iframeUrl) return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <h1 className="section-title text-center mb-6">{t('payment.title')}</h1>
        <div className="card overflow-hidden rounded-2xl shadow-xl">
          <iframe src={iframeUrl} width="100%" height="600" frameBorder="0" title="Paymob Payment" className="block" />
        </div>
      </div>
    </div>
  )

  if (method === 'fawry') return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-6">
          <Building2 size={40} className="text-orange-500" />
        </div>
        <h1 className="section-title mb-2">{t('payment.fawryRef')}</h1>
        <p className="text-navy/60 dark:text-cream/60 mb-6">{t('payment.fawryInstruction')}</p>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 mb-6">
          <p className="text-4xl font-mono font-bold text-orange-600 dark:text-orange-400 tracking-widest mb-3">{fawryRef || 'MOCK-12345678'}</p>
          <button onClick={copyRef} className="flex items-center gap-2 mx-auto text-sm text-orange-600 dark:text-orange-400 hover:underline font-medium">
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Reference'}
          </button>
        </div>
        {order && <p className="text-sm text-navy/50 dark:text-cream/50 mb-6">Order #{order.orderNumber}</p>}
        <Link to="/" className="btn-primary">{t('payment.viewOrder')}</Link>
      </motion.div>
    </div>
  )

  // COD or default
  return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <Banknote size={40} className="text-green-500" />
        </div>
        <h1 className="section-title mb-2">{t('payment.codTitle')}</h1>
        <p className="text-navy/60 dark:text-cream/60 mb-6">{t('payment.codInstruction')}</p>
        {order && (
          <Link to="/order-confirmation" state={{ order }} className="btn-primary">{t('payment.viewOrder')}</Link>
        )}
      </motion.div>
    </div>
  )
}
