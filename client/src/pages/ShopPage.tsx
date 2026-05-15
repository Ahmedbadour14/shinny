import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Product } from '../types'
import ProductCard from '../components/ProductCard'
import { useLangStore } from '../store/languageStore'

const CATEGORIES = ['All', 'Small', 'Medium', 'Large', 'Clutch', 'Shoulder Bag']
const COLORS = ['Gold', 'Silver', 'Blue', 'Pink', 'White', 'Cream', 'Crimson', 'Turquoise', 'Emerald', 'Lavender', 'Copper', 'Orange']
const SORT_OPTIONS = [
  { value: '', label: 'shop.sort.default' },
  { value: 'price_asc', label: 'shop.sort.priceAsc' },
  { value: 'price_desc', label: 'shop.sort.priceDesc' },
  { value: 'newest', label: 'shop.sort.newest' },
]

export default function ShopPage() {
  const { t } = useTranslation()
  const { lang } = useLangStore()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [selectedColor, setSelectedColor] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (category && category !== 'All') params.category = category
      if (selectedColor) params.color = selectedColor
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      if (sort) params.sort = sort
      const { data } = await axios.get('/api/products', { params })
      setProducts(data)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [search, category, selectedColor, minPrice, maxPrice, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function clearFilters() {
    setSearch(''); setCategory('All'); setSelectedColor(''); setMinPrice(''); setMaxPrice(''); setSort('')
    setSearchParams({})
  }

  const hasFilters = search || category !== 'All' || selectedColor || minPrice || maxPrice || sort

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-sm font-bold text-navy dark:text-cream uppercase tracking-wider mb-3">{t('categories.title')}</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${category === c ? 'bg-gold border-gold text-white' : 'border-cream dark:border-navy-lighter text-navy/70 dark:text-cream/70 hover:border-gold hover:text-gold'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-sm font-bold text-navy dark:text-cream uppercase tracking-wider mb-3">{t('product.color')}</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setSelectedColor(selectedColor === c ? '' : c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedColor === c ? 'bg-gold border-gold text-white' : 'border-cream dark:border-navy-lighter text-navy/70 dark:text-cream/70 hover:border-gold hover:text-gold'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-bold text-navy dark:text-cream uppercase tracking-wider mb-3">{t('shop.priceRange')}</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="input-field text-sm py-2" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-field text-sm py-2" />
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium">
          <X size={14} /> {t('shop.clearFilters')}
        </button>
      )}
    </div>
  )

  return (
    <div className="pt-24 min-h-screen">
      {/* Page header */}
      <div className="page-hero py-16">
        <div className="pattern-dots absolute inset-0 opacity-30" />
        <div className="relative text-center">
          <h1 className="section-title text-cream">{t('shop.title')}</h1>
          <p className="text-cream/60 mt-2">{products.length} {lang === 'ar' ? 'قطعة' : 'pieces'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 dark:text-cream/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('shop.search')}
              className="input-field pl-9"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)} className="input-field pr-8 appearance-none cursor-pointer min-w-[180px]">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 dark:text-cream/40 pointer-events-none" />
          </div>

          {/* Filter toggle (mobile) */}
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="sm:hidden flex items-center gap-2 btn-secondary py-2 px-4">
            <SlidersHorizontal size={16} /> {t('shop.filters')}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden sm:block w-56 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-navy-light rounded-2xl p-5 shadow-sm">
              <h2 className="font-serif font-semibold text-navy dark:text-cream mb-5 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-gold" /> {t('shop.filters')}
              </h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile filters drawer */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="fixed inset-0 z-30 sm:hidden bg-white dark:bg-navy p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif font-semibold text-navy dark:text-cream">{t('shop.filters')}</h2>
                  <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
                </div>
                <FilterPanel />
                <button onClick={() => setFiltersOpen(false)} className="btn-primary w-full mt-6">
                  {lang === 'ar' ? 'تطبيق الفلاتر' : 'Apply Filters'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card aspect-[3/4] shimmer" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-navy/50 dark:text-cream/50 text-lg mb-4">{t('shop.noResults')}</p>
                <button onClick={clearFilters} className="btn-primary">{t('shop.clearFilters')}</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
