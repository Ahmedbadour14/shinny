import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useLangStore } from '../store/languageStore'
import { Gem, Heart, Globe, Award } from 'lucide-react'

const VALUES = [
  { icon: <Gem size={24} />, key: 'handmade' },
  { icon: <Heart size={24} />, key: 'ethical' },
  { icon: <Award size={24} />, key: 'quality' },
  { icon: <Globe size={24} />, key: 'unique' },
]

const TEAM_IMAGE = 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'

export default function AboutPage() {
  const { t } = useTranslation()
  const { lang } = useLangStore()

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="page-hero py-24">
        <div className="pattern-dots absolute inset-0 opacity-30" />
        <div className="relative text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-cream text-4xl md:text-5xl mb-4">
            {t('about.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-gold text-lg font-medium">
            {t('about.subtitle')}
          </motion.p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="relative">
              <img src={TEAM_IMAGE} alt="Our craft" className="w-full aspect-square object-cover rounded-3xl shadow-xl" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 gold-gradient rounded-2xl flex flex-col items-center justify-center text-white shadow-xl">
                <span className="text-3xl font-bold font-serif">5+</span>
                <span className="text-xs text-center leading-tight">{lang === 'ar' ? 'سنوات من الحرفية' : 'Years of\nCraftsmanship'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <h2 className="section-title">{lang === 'ar' ? 'من نحن' : 'Who We Are'}</h2>
            <p className="text-navy/70 dark:text-cream/70 leading-relaxed">{t('about.story')}</p>
            <div className="h-px bg-gradient-to-r from-gold to-transparent" />
            <div>
              <h3 className="font-serif font-bold text-xl text-navy dark:text-cream mb-2">{t('about.mission')}</h3>
              <p className="text-navy/70 dark:text-cream/70 leading-relaxed">{t('about.missionText')}</p>
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-navy dark:text-cream mb-2">{t('about.craft')}</h3>
              <p className="text-navy/70 dark:text-cream/70 leading-relaxed">{t('about.craftText')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-navy dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-cream text-center mb-12">{lang === 'ar' ? 'قيمنا' : 'Our Values'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-navy-light dark:bg-navy rounded-2xl border border-gold/10"
              >
                <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white mx-auto mb-4">
                  {v.icon}
                </div>
                <p className="text-cream font-semibold text-sm">{t(`about.values.${v.key}`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="section-title text-center mb-12">{lang === 'ar' ? 'عملية الإنتاج' : 'How We Create'}</h2>
        <div className="space-y-8">
          {[
            { step: '01', en: 'Design & Sketch', ar: 'التصميم والرسم', desc: { en: 'Every bag starts as a sketch inspired by Egyptian art.', ar: 'كل حقيبة تبدأ كرسمة مستوحاة من الفن المصري.' } },
            { step: '02', en: 'Bead Selection', ar: 'اختيار الخرز', desc: { en: 'Premium beads are handpicked for color and quality.', ar: 'يتم اختيار الخرز عالي الجودة يدوياً للون والجودة.' } },
            { step: '03', en: 'Hand Crafting', ar: 'الصنع اليدوي', desc: { en: '15–40 hours of careful beadwork by skilled artisans.', ar: '١٥ إلى ٤٠ ساعة من العمل الدقيق على يد حرفيين مهرة.' } },
            { step: '04', en: 'Quality Check', ar: 'فحص الجودة', desc: { en: 'Each piece is inspected before being packaged with care.', ar: 'يتم فحص كل قطعة قبل تغليفها بعناية.' } },
          ].map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-5 items-start"
            >
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white font-bold font-serif flex-shrink-0 shadow-md shadow-gold/20">
                {step.step}
              </div>
              <div className="flex-1 bg-white dark:bg-navy-light rounded-2xl p-5 shadow-sm">
                <h3 className="font-serif font-bold text-navy dark:text-cream mb-1">{lang === 'ar' ? step.ar : step.en}</h3>
                <p className="text-navy/60 dark:text-cream/60 text-sm">{lang === 'ar' ? step.desc.ar : step.desc.en}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
