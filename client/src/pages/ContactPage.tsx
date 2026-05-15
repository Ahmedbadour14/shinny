import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, MapPin, Instagram, Facebook, Send, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLangStore } from '../store/languageStore'

const WHATSAPP_NUM = '201014136670'

export default function ContactPage() {
  const { t } = useTranslation()
  const { lang } = useLangStore()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setSending(false)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="page-hero py-20">
        <div className="pattern-dots absolute inset-0 opacity-30" />
        <div className="relative text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-cream text-4xl md:text-5xl mb-3">
            {t('contact.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-cream/60 text-lg">
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="section-title mb-6">{lang === 'ar' ? 'كيف تتواصل معنا' : 'Reach Us'}</h2>
              <div className="space-y-4">
                {/* WhatsApp */}
                <motion.a
                  href={`https://wa.me/${WHATSAPP_NUM}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-5 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 group"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-400">{t('contact.whatsapp')}</p>
                    <p className="text-sm text-green-600/70 dark:text-green-400/70 dir-ltr">+{WHATSAPP_NUM}</p>
                  </div>
                </motion.a>

                {/* Email */}
                <motion.a
                  href={`mailto:${t('contact.emailAddress')}`}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-5 bg-gold/5 rounded-2xl border border-gold/20 group"
                >
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy dark:text-cream">{t('contact.email')}</p>
                    <p className="text-sm text-navy/60 dark:text-cream/60">{t('contact.emailAddress')}</p>
                  </div>
                </motion.a>

                {/* Location */}
                <div className="flex items-center gap-4 p-5 bg-cream/20 dark:bg-navy-light rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-navy dark:bg-cream flex items-center justify-center">
                    <MapPin size={22} className="text-cream dark:text-navy" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy dark:text-cream">{lang === 'ar' ? 'موقعنا' : 'Location'}</p>
                    <p className="text-sm text-navy/60 dark:text-cream/60">{t('contact.location')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-serif font-semibold text-navy dark:text-cream mb-4">{t('contact.follow')}</h3>
              <div className="flex gap-3">
                <a href="https://instagram.com/shinny.eg" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-semibold hover:scale-105 transition-transform">
                  <Instagram size={16} /> Instagram
                </a>
                <a href="https://facebook.com/shinny.eg" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:scale-105 transition-transform">
                  <Facebook size={16} /> Facebook
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUM}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:scale-105 transition-transform">
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white dark:bg-navy-light rounded-2xl p-8 shadow-sm">
              <h2 className="font-serif font-semibold text-navy dark:text-cream text-xl mb-6">
                {lang === 'ar' ? 'أرسل رسالة' : 'Send a Message'}
              </h2>
              {sent ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center h-48 gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle size={36} className="text-green-500" />
                  </div>
                  <p className="font-semibold text-navy dark:text-cream">{t('contact.sent')}</p>
                  <p className="text-sm text-navy/50 dark:text-cream/50 text-center">{lang === 'ar' ? 'سنرد عليك قريباً' : 'We\'ll get back to you soon!'}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-navy dark:text-cream mb-1 block">{t('contact.name')}</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy dark:text-cream mb-1 block">{t('checkout.email')}</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy dark:text-cream mb-1 block">{t('contact.message')}</label>
                    <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows={5} className="input-field resize-none" />
                  </div>
                  <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Send size={16} />
                    {sending ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...') : t('contact.send')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
