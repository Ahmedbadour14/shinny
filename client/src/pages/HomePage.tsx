import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Star, Sparkles, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Product } from '../types'
import { useLangStore } from '../store/languageStore'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['Small', 'Medium', 'Large', 'Clutch', 'Shoulder Bag']

const TESTIMONIALS = [
  { name: 'Nour Ahmed', nameAr: 'نور أحمد', text: 'Absolutely stunning quality! My bag got so many compliments at the wedding.', textAr: 'جودة مذهلة! حقيبتي نالت الكثير من الإطراء في حفل الزفاف.', rating: 5, city: 'Cairo' },
  { name: 'Sara El-Masry', nameAr: 'سارة المصري', text: 'The craftsmanship is unreal. Every bead is perfectly placed. Worth every penny!', textAr: 'الحرفية لا تصدق. كل خرزة موضوعة بإتقان. تستحق كل قرش!', rating: 5, city: 'Alexandria' },
  { name: 'Mona Khalil', nameAr: 'منى خليل', text: 'I ordered the golden clutch and it arrived beautifully packaged. Shinny is now my go-to for gifts.', textAr: 'طلبت حقيبة اليد الذهبية ووصلت في تغليف رائع. شيني أصبح خياري الأول للهدايا.', rating: 5, city: 'Giza' },
]

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80',
  'https://images.unsplash.com/photo-1566150905458-1bf1f62b7295?w=400&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
  'https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=400&q=80',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80',
  'https://images.unsplash.com/photo-1559563458-527498076e2e?w=400&q=80',
  'https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=400&q=80',
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80',
  'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&q=80',
]

export default function HomePage() {
  const { t } = useTranslation()
  const { lang } = useLangStore()
  const [featured, setFeatured] = useState<Product[]>([])
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  useEffect(() => {
    axios.get('/api/products?featured=true').then(r => setFeatured(r.data.slice(0, 4))).catch(() => {})
  }, [])

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #252545 40%, #1A1A2E 100%)' }}>
        {/* Animated pattern */}
        <div className="absolute inset-0 pattern-dots opacity-40" />
        {/* Gold orbs */}
        <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gold/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge bg-gold/20 text-gold border border-gold/30 mb-6 inline-flex">
              <Sparkles size={12} />
              {t('hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold leading-tight mb-6"
          >
            <span className="text-white">{lang === 'ar' ? 'حقائب خرز' : 'Artisan'}</span>
            <br />
            <span className="text-gold-shine">{lang === 'ar' ? 'فنية' : 'Beaded Bags'}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-cream/70 text-lg md:text-xl max-w-xl mx-auto mb-10"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/shop" className="btn-primary flex items-center justify-center gap-2 text-base">
              {t('hero.cta')}
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-secondary border-cream/30 text-cream hover:bg-cream hover:text-navy flex items-center justify-center gap-2 text-base">
              {t('hero.explore')}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/40"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-4 bg-cream/20 dark:bg-navy-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('categories.title')}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/shop?category=${cat}`} className="group flex flex-col items-center gap-3 p-6 bg-white dark:bg-navy rounded-2xl shadow-sm hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <span className="text-white text-xs font-bold">{cat[0]}</span>
                  </div>
                  <span className="text-sm font-semibold text-navy dark:text-cream group-hover:text-gold transition-colors text-center">{cat}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">{t('featured.title')}</h2>
              <p className="section-subtitle">{t('featured.subtitle')}</p>
            </div>
            <Link to="/shop" className="btn-ghost hidden md:flex items-center gap-1 text-gold">
              {lang === 'ar' ? 'عرض الكل' : 'View All'} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.length > 0
              ? featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
              : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card aspect-[3/4] shimmer" />
              ))
            }
          </div>
          <div className="text-center mt-10 md:hidden">
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              {lang === 'ar' ? 'عرض الكل' : 'View All'} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 bg-navy dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-cream text-center mb-12">{t('testimonials.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t2, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-navy-light dark:bg-navy rounded-2xl p-6 border border-gold/10"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t2.rating }).map((_, j) => <Star key={j} size={14} className="fill-gold text-gold" />)}
                </div>
                <p className="text-cream/80 text-sm leading-relaxed mb-4">{lang === 'ar' ? t2.textAr : t2.text}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-white text-xs font-bold">
                    {(lang === 'ar' ? t2.nameAr : t2.name)[0]}
                  </div>
                  <div>
                    <p className="text-cream text-sm font-semibold">{lang === 'ar' ? t2.nameAr : t2.name}</p>
                    <p className="text-cream/40 text-xs">{t2.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM GALLERY */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('gallery.title')}</h2>
            <p className="text-gold font-semibold">{t('gallery.subtitle')}</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {GALLERY_IMAGES.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group aspect-square overflow-hidden rounded-xl cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="https://instagram.com/shinny.eg" target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
              {lang === 'ar' ? 'تابعنا على انستغرام' : 'Follow us on Instagram'} @shinny.eg
            </a>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #C9A84C, #D4B96A, #B8923C)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              {lang === 'ar' ? 'اكتشف مجموعتنا الكاملة' : 'Discover Our Full Collection'}
            </h2>
            <p className="text-white/80 mb-8">{lang === 'ar' ? 'أكثر من ١٢ قطعة فريدة تنتظرك' : 'Over 12 unique handmade pieces waiting for you'}</p>
            <Link to="/shop" className="bg-white text-gold font-bold px-8 py-3 rounded-full hover:shadow-xl transition-shadow inline-flex items-center gap-2">
              {t('hero.cta')} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
