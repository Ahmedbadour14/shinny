import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Search, Menu, X, Sun, Moon, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useThemeStore } from '../store/themeStore'
import { useLangStore } from '../store/languageStore'

export default function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { getItemCount } = useCartStore()
  const { ids: wishlistIds } = useWishlistStore()
  const { dark, toggle: toggleTheme } = useThemeStore()
  const { lang, setLang } = useLangStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  const isActive = (to: string) => location.pathname === to

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy/90 backdrop-blur-md shadow-lg shadow-navy/10' : 'bg-navy/50 backdrop-blur-md'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center shadow-md group-hover:shadow-gold/40 transition-shadow">
              <span className="text-white font-serif font-bold text-sm">S</span>
            </div>
            <span className="font-serif text-xl font-bold text-white group-hover:text-gold transition-colors">
              Shinny
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative font-medium text-sm transition-colors duration-200 group ${isActive(link.to) ? 'text-gold' : 'text-white hover:text-gold'}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 ${isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-gold">
              <Search size={18} />
            </button>

            {/* Lang toggle */}
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-gold flex items-center gap-1">
              <Globe size={18} />
              <span className="text-xs font-bold hidden sm:block">{lang === 'en' ? 'ع' : 'EN'}</span>
            </button>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-gold">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Wishlist */}
            <Link to="/shop" className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-gold">
              <Heart size={18} />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-gold">
              <ShoppingBag size={18} />
              {getItemCount() > 0 && (
                <motion.span
                  key={getItemCount()}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {getItemCount()}
                </motion.span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors text-white">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-3">
              <form onSubmit={e => { e.preventDefault(); if (searchQuery) window.location.href = `/shop?search=${searchQuery}` }} className="flex gap-2">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('shop.search')}
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary py-2 px-4 text-sm">{t('common.view')}</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white dark:bg-navy border-t border-cream/30 dark:border-navy-lighter px-4 pb-4"
          >
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`block py-3 text-base font-medium border-b border-cream/20 dark:border-navy-lighter last:border-0 ${isActive(link.to) ? 'text-gold' : 'text-navy dark:text-cream'}`}>
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
