import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react'
import axios from 'axios'
import { Product } from '../../types'

function getToken() { return localStorage.getItem('shinny_admin_token') || '' }
const headers = () => ({ Authorization: `Bearer ${getToken()}` })

const EMPTY: Partial<Product & { imageUrls: string }> = {
  name: '', nameAr: '', description: '', descriptionAr: '',
  price: 0, category: 'Small', colors: [], sizes: [], stock: 100, featured: false, imageUrls: '',
}

const CATEGORIES = ['Small', 'Medium', 'Large', 'Clutch', 'Shoulder Bag']

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<any>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/admin/products', { headers: headers() })
      setProducts(data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditing(null); setForm({ ...EMPTY }); setShowForm(true)
  }
  function openEdit(p: Product) {
    setEditing(p)
    setForm({ ...p, imageUrls: p.images.join('\n'), colors: p.colors, sizes: p.sizes })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        ...form,
        colors: JSON.stringify(typeof form.colors === 'string' ? form.colors.split(',').map((s: string) => s.trim()) : form.colors),
        sizes: JSON.stringify(typeof form.sizes === 'string' ? form.sizes.split(',').map((s: string) => s.trim()) : form.sizes),
        imageUrls: JSON.stringify((form.imageUrls || '').split('\n').map((s: string) => s.trim()).filter(Boolean)),
      }
      if (editing) {
        await axios.put(`/api/admin/products/${editing.id}`, payload, { headers: headers() })
      } else {
        await axios.post('/api/admin/products', payload, { headers: headers() })
      }
      setShowForm(false); load()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    try { await axios.delete(`/api/admin/products/${id}`, { headers: headers() }); load() }
    catch {}
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-navy dark:text-cream">Products</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white dark:bg-navy-light rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/20 dark:bg-navy border-b border-cream/30 dark:border-navy-lighter">
                <tr>
                  {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-navy/50 dark:text-cream/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/20 dark:divide-navy-lighter">
                {products.map(p => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-cream/10 dark:hover:bg-navy transition-colors">
                    <td className="px-4 py-3">
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy dark:text-cream">{p.name}</p>
                      <p className="text-xs text-navy/40 dark:text-cream/40">{p.nameAr}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-gold/10 text-gold text-xs">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gold">EGP {p.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-navy dark:text-cream">{p.stock}</td>
                    <td className="px-4 py-3">
                      {p.featured ? <Star size={16} className="fill-gold text-gold" /> : <Star size={16} className="text-navy/20 dark:text-cream/20" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:scale-110 transition-transform">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:scale-110 transition-transform">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-navy-light rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif font-bold text-lg text-navy dark:text-cream">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowForm(false)}><X size={20} className="text-navy/50 dark:text-cream/50" /></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Name (EN)', type: 'text' },
                  { key: 'nameAr', label: 'Name (AR)', type: 'text' },
                  { key: 'price', label: 'Price (EGP)', type: 'number' },
                  { key: 'stock', label: 'Stock', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-navy dark:text-cream mb-1 block">{f.label}</label>
                    <input type={f.type} value={form[f.key] ?? ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="input-field text-sm py-2" />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-navy dark:text-cream mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field text-sm py-2">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-navy dark:text-cream mb-1 block">Colors (comma-separated)</label>
                  <input value={Array.isArray(form.colors) ? form.colors.join(', ') : form.colors} onChange={e => setForm({ ...form, colors: e.target.value })} className="input-field text-sm py-2" placeholder="Gold, Silver, Blue" />
                </div>
                <div>
                  <label className="text-xs font-medium text-navy dark:text-cream mb-1 block">Sizes (comma-separated)</label>
                  <input value={Array.isArray(form.sizes) ? form.sizes.join(', ') : form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} className="input-field text-sm py-2" placeholder="Small, Medium" />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-navy dark:text-cream mb-1 block">Image URLs (one per line)</label>
                  <textarea value={form.imageUrls ?? ''} onChange={e => setForm({ ...form, imageUrls: e.target.value })} rows={3} className="input-field text-sm py-2 resize-none" placeholder="https://..." />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-navy dark:text-cream mb-1 block">Description (EN)</label>
                  <textarea value={form.description ?? ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="input-field text-sm py-2 resize-none" />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-navy dark:text-cream mb-1 block">Description (AR)</label>
                  <textarea value={form.descriptionAr ?? ''} onChange={e => setForm({ ...form, descriptionAr: e.target.value })} rows={2} dir="rtl" className="input-field text-sm py-2 resize-none" />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.featured ?? false} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-gold" />
                  <label htmlFor="featured" className="text-sm font-medium text-navy dark:text-cream">Featured product</label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Product'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-secondary py-3 px-5">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-navy-light rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
              <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-navy dark:text-cream text-lg mb-2">Delete Product?</h3>
              <p className="text-navy/60 dark:text-cream/60 text-sm mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors">Delete</button>
                <button onClick={() => setDeleteId(null)} className="flex-1 btn-secondary py-2.5">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
