import { Link } from 'react-router-dom'
import { Instagram, Facebook, MessageCircle, Mail, MapPin, Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const WHATSAPP_NUM = '201014136670'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-navy dark:bg-black text-cream">
      {/* Wave top */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white dark:text-navy -mb-px">
          <path d="M0 40L1440 40L1440 0C1200 30 960 40 720 40C480 40 240 30 0 0L0 40Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center shadow-md">
                <span className="text-white font-serif font-bold text-sm">S</span>
              </div>
              <span className="font-serif text-2xl font-bold text-cream">Shinny</span>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">{t('footer.tagline')}</p>
            <div className="flex items-center gap-4 mt-6">
              <a href={`https://wa.me/${WHATSAPP_NUM}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 transition-transform">
                <MessageCircle size={16} className="text-white" />
              </a>
              <a href="https://instagram.com/shinny.eg" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-transform">
                <Instagram size={16} className="text-white" />
              </a>
              <a href="https://facebook.com/shinny.eg" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform">
                <Facebook size={16} className="text-white" />
              </a>
              <a href="mailto:hello@shinny.eg" className="w-9 h-9 rounded-full bg-gold flex items-center justify-center hover:scale-110 transition-transform">
                <Mail size={16} className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-serif font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/shop', label: t('nav.shop') },
                { to: '/about', label: t('nav.about') },
                { to: '/contact', label: t('nav.contact') },
              ].map(link => (
                <li key={link.to}><Link to={link.to} className="hover:text-gold transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-gold font-serif font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm text-cream/60">
              <li><a href="#" className="hover:text-gold transition-colors">{t('footer.faq')}</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">{t('footer.shipping')}</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">{t('footer.returns')}</a></li>
              <li>
                <div className="flex items-center gap-1.5 text-cream/60">
                  <MapPin size={13} />
                  <span>{t('contact.location')}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/40">{t('footer.rights')}</p>
          <p className="text-xs text-cream/40 flex items-center gap-1">
            Made with <Heart size={11} className="text-gold fill-gold" /> in Egypt
          </p>
        </div>
      </div>
    </footer>
  )
}
