import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import axios from 'axios'
import { formatPrice } from '../../utils/helpers'

function getToken() { return localStorage.getItem('shinny_admin_token') || '' }
const headers = () => ({ Authorization: `Bearer ${getToken()}` })

const STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  async function load() {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/admin/orders', {
        headers: headers(),
        params: { status: statusFilter, page, limit: 15 },
      })
      setOrders(data.orders)
      setTotal(data.total)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [statusFilter, page])

  async function updateStatus(id: number, status: string) {
    try {
      await axios.put(`/api/admin/orders/${id}`, { status }, { headers: headers() })
      load()
    } catch {}
  }

  const filtered = search
    ? orders.filter(o => o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || o.customerName?.toLowerCase().includes(search.toLowerCase()))
    : orders

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-navy dark:text-cream">Orders ({total})</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 dark:text-cream/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order or customer..." className="input-field pl-8 py-2 text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${statusFilter === s ? 'bg-gold border-gold text-white' : 'border-cream dark:border-navy-lighter text-navy/60 dark:text-cream/60 hover:border-gold hover:text-gold'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white dark:bg-navy-light rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/20 dark:bg-navy border-b border-cream/30 dark:border-navy-lighter">
                <tr>
                  {['Order #', 'Customer', 'Date', 'Payment', 'Total', 'Status', 'Update'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-navy/50 dark:text-cream/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/20 dark:divide-navy-lighter">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-navy/40 dark:text-cream/40">No orders found</td></tr>
                ) : filtered.map(order => (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-cream/10 dark:hover:bg-navy transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-gold text-xs">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy dark:text-cream">{order.customerName}</p>
                      <p className="text-xs text-navy/40 dark:text-cream/40">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-navy/60 dark:text-cream/60 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-EG')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-navy/5 dark:bg-cream/5 text-navy dark:text-cream text-xs capitalize">{order.paymentMethod}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gold">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className="appearance-none bg-cream/30 dark:bg-navy text-navy dark:text-cream text-xs rounded-lg px-2 py-1.5 pr-5 border border-cream dark:border-navy-lighter focus:outline-none focus:border-gold cursor-pointer"
                        >
                          {STATUSES.filter(s => s !== 'all').map(s => (
                            <option key={s} value={s} className="capitalize">{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-navy/40 dark:text-cream/40" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {total > 15 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-cream dark:border-navy-lighter text-sm disabled:opacity-40 hover:border-gold hover:text-gold transition-colors">
            Previous
          </button>
          <span className="text-sm text-navy/50 dark:text-cream/50">Page {page} of {Math.ceil(total / 15)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 15)} className="px-4 py-2 rounded-xl border border-cream dark:border-navy-lighter text-sm disabled:opacity-40 hover:border-gold hover:text-gold transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  )
}
