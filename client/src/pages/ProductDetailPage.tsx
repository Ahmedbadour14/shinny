import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, MessageCircle, ChevronLeft, ChevronRight, Star, Ruler } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useLangStore } from '../store/languageStore'
import { formatPrice } from '../utils/helpers'
import ProductCard from '../components/ProductCard'

const WHATSAPP_NUM = '201014136670'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const { lang } = useLangStore()
  const { addItem } = useCartStore()
  const { toggle, has } = useWishlistStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [activeImg, setActiveImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [tab, setTab] = useState<'desc' | 'size'>('desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/products/${id}`).then(r => {
      setProduct(r.data)
      setSelectedColor(r.data.colors[0] || '')
      setSelectedSize(r.data.sizes[0] || '')
      setActiveImg(0)
      return axios.get(`/api/products?category=${r.data.category}`)
    }).then(r => {
      setRelated(r.data.filter((p: Product) => p.id !== Number(id)).slice(0, 4))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="pt-24 min-h-screen flex items-center justify-center text-center">
      <div>
        <p className="text-navy/50 dark:text-cream/50 text-lg mb-4">Product not found</p>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    </div>
  )

  const name = lang === 'ar' ? product.nameAr : product.name
  const description = lang === 'ar' ? product.descriptionAr : product.description

  function handleAddToCart() {
    addItem(product!, qty, selectedColor, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const waMsg = encodeURIComponent(`Hello Shinny! I'm interested in: ${product.name} (${formatPrice(product.price)}) — Color: ${selectedColor}, Size: ${selectedSize}`)

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-navy/50 dark:text-cream/50 mb-8">
          <Link to="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          <span>/</span>
          <span className="text-navy dark:text-cream">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream/20 dark:bg-navy-light mb-4">
              <motion.img
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[activeImg]}
                alt={name}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-navy/90 flex items-center justify-center shadow-md hover:bg-gold hover:text-white transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setActiveImg(i => (i + 1) % product.images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-navy/90 flex items-center justify-center shadow-md hover:bg-gold hover:text-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-gold shadow-md shadow-gold/20' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="badge bg-gold/10 text-gold mb-2">{product.category}</span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy dark:text-cream mb-2">{name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-gold text-gold" />)}</div>
                <span className="text-sm text-navy/50 dark:text-cream/50">(24 reviews)</span>
              </div>
              <div className="text-3xl font-bold text-gold">{formatPrice(product.price, lang)}</div>
            </div>

            {/* Color */}
            <div>
              <p className="text-sm font-semibold text-navy dark:text-cream mb-2">{t('product.color')}: <span className="text-gold">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 rounded-full text-sm border-2 transition-all font-medium ${selectedColor === c ? 'border-gold bg-gold/10 text-gold' : 'border-cream dark:border-navy-lighter text-navy/70 dark:text-cream/70 hover:border-gold hover:text-gold'}`}>{c}</button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <p className="text-sm font-semibold text-navy dark:text-cream mb-2">{t('product.size')}: <span className="text-gold">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-full text-sm border-2 transition-all font-medium ${selectedSize === s ? 'border-gold bg-gold/10 text-gold' : 'border-cream dark:border-navy-lighter text-navy/70 dark:text-cream/70 hover:border-gold hover:text-gold'}`}>{s}</button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-cream/30 dark:bg-navy-light rounded-full px-3 py-1">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-7 h-7 rounded-full hover:bg-gold hover:text-white transition-colors flex items-center justify-center font-bold">−</button>
                <span className="w-8 text-center font-semibold text-navy dark:text-cream">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-7 h-7 rounded-full hover:bg-gold hover:text-white transition-colors flex items-center justify-center font-bold">+</button>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ {t('product.inStock')}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart} className={`flex-1 btn-primary flex items-center justify-center gap-2 ${added ? 'bg-green-500 hover:bg-green-500' : ''}`}>
                <ShoppingBag size={18} />
                {added ? t('product.addedToCart') : t('product.addToCart')}
              </motion.button>
              <button onClick={() => toggle(product.id)} className={`p-3 rounded-full border-2 transition-all ${has(product.id) ? 'border-gold bg-gold/10 text-gold' : 'border-cream dark:border-navy-lighter text-navy/50 dark:text-cream/50 hover:border-gold hover:text-gold'}`}>
                <Heart size={20} className={has(product.id) ? 'fill-gold' : ''} />
              </button>
              <a href={`https://wa.me/${WHATSAPP_NUM}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all">
                <MessageCircle size={20} />
              </a>
            </div>

            {/* Tabs */}
            <div className="border-t border-cream/30 dark:border-navy-lighter pt-6">
              <div className="flex gap-6 mb-4">
                <button onClick={() => setTab('desc')} className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${tab === 'desc' ? 'border-gold text-gold' : 'border-transparent text-navy/50 dark:text-cream/50 hover:text-gold'}`}>
                  {t('product.description')}
                </button>
                <button onClick={() => setTab('size')} className={`text-sm font-semibold pb-1 border-b-2 transition-colors flex items-center gap-1 ${tab === 'size' ? 'border-gold text-gold' : 'border-transparent text-navy/50 dark:text-cream/50 hover:text-gold'}`}>
                  <Ruler size={14} /> {t('product.sizeGuide')}
                </button>
              </div>
              {tab === 'desc' ? (
                <p className="text-navy/70 dark:text-cream/70 leading-relaxed text-sm">{description}</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  {[['Small', '15x12cm', '0.3kg'], ['Medium', '22x18cm', '0.5kg'], ['Large', '30x25cm', '0.8kg'], ['One Size', '20x15cm', '0.4kg']].map(([s, d, w]) => (
                    <div key={s} className="bg-cream/20 dark:bg-navy-light rounded-xl p-3">
                      <p className="font-bold text-gold">{s}</p>
                      <p className="text-navy/60 dark:text-cream/60">{d}</p>
                      <p className="text-navy/40 dark:text-cream/40">{w}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="section-title mb-8">{t('product.related')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
