import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const WHATSAPP_NUM = '201014136670'

export default function WhatsAppFab() {
  const { t } = useTranslation()
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUM}?text=Hello Shinny! I'm interested in your beaded bags.`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 300 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 px-4 py-3 transition-colors"
    >
      <MessageCircle size={20} />
      <span className="text-sm font-semibold hidden sm:block">{t('contact.whatsapp')}</span>
    </motion.a>
  )
}
