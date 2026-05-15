import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useLangStore } from '../store/languageStore'
import { formatPrice } from '../utils/helpers'

interface Props {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { t } = useTranslation()
  const { lang } = useLangStore()
  const { addItem } = useCartStore()
  const { toggle, has } = useWishlistStore()
  const [added, setAdded] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const name = lang === 'ar' ? product.nameAr : product.name
  const isWished = has(product.id)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1, product.colors[0] || 'Default', product.sizes[0] || 'One Size')
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="card overflow-hidden">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-cream/30 dark:bg-navy-light">
            {!imgLoaded && (
              <div className="absolute inset-0 shimmer" />
            )}
            <img
              src={product.images[0]}
              alt={name}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Overlay actions */}
            <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${added ? 'bg-green-500 text-white' : 'bg-white text-navy hover:bg-gold hover:text-white'}`}
              >
                <ShoppingBag size={16} />
              </motion.button>
              <Link to={`/product/${product.id}`} onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-full bg-white text-navy hover:bg-gold hover:text-white flex items-center justify-center shadow-lg transition-all duration-200">
                <Eye size={16} />
              </Link>
            </div>

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-navy/90 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            >
              <Heart size={14} className={isWished ? 'fill-gold text-gold' : 'text-navy/50 dark:text-cream/50'} />
            </button>

            {/* Featured badge */}
            {product.featured && (
              <span className="absolute top-3 left-3 badge bg-gold text-white text-[10px]">
                ✦ Featured
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-serif font-semibold text-navy dark:text-cream line-clamp-1 group-hover:text-gold transition-colors">
              {name}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-gold">{formatPrice(product.price, lang)}</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map(c => (
                  <span
                    key={c}
                    className="w-3 h-3 rounded-full border border-white dark:border-navy shadow-sm"
                    style={{ backgroundColor: c.toLowerCase() === 'gold' ? '#C9A84C' : c.toLowerCase() === 'cream' ? '#E8D5B7' : c.toLowerCase() === 'navy' ? '#1A1A2E' : c.toLowerCase() }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`mt-3 w-full py-2 rounded-full text-sm font-semibold transition-all duration-300 ${added ? 'bg-green-500 text-white' : 'bg-cream/50 dark:bg-navy-lighter text-navy dark:text-cream hover:bg-gold hover:text-white'}`}
            >
              {added ? t('product.addedToCart') : t('product.addToCart')}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
