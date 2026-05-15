import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ShoppingCart, Package, Clock } from 'lucide-react'
import axios from 'axios'
import { formatPrice } from '../../utils/helpers'

interface Stats {
  totalOrders: number
  totalRevenue: number
  products: number
  pendingOrders: number
  confirmedOrders: number
  monthlyRevenue: { month: string; revenue: number }[]
}

function getToken() { return localStorage.getItem('shinny_admin_token') || '' }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: <TrendingUp size={22} />, color: 'from-gold to-gold-dark', change: '+12%' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingCart size={22} />, color: 'from-blue-500 to-blue-600', change: '+5%' },
    { label: 'Total Products', value: stats.products, icon: <Package size={22} />, color: 'from-purple-500 to-purple-600', change: '—' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: <Clock size={22} />, color: 'from-orange-400 to-orange-500', change: stats.pendingOrders > 0 ? '⚠' : '✓' },
  ] : []

  const maxRevenue = stats ? Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1) : 1

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-navy dark:text-cream">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-navy-light rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white`}>
                {card.icon}
              </div>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">{card.change}</span>
            </div>
            <p className="text-2xl font-bold text-navy dark:text-cream">{String(card.value)}</p>
            <p className="text-xs text-navy/50 dark:text-cream/50 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart (CSS bars) */}
      {stats && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif font-semibold text-navy dark:text-cream mb-6">Monthly Revenue (EGP)</h2>
          <div className="flex items-end gap-3 h-40">
            {stats.monthlyRevenue.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-gold">{m.revenue > 0 ? formatPrice(m.revenue).replace('EGP ', '') : '—'}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, (m.revenue / maxRevenue) * 100)}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="w-full rounded-t-lg gold-gradient min-h-[4px]"
                />
                <span className="text-xs text-navy/50 dark:text-cream/50">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick summary */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-navy-light rounded-2xl p-5 shadow-sm">
            <h3 className="font-serif font-semibold text-navy dark:text-cream mb-3">Order Status</h3>
            <div className="space-y-2">
              {[
                { label: 'Confirmed', value: stats.confirmedOrders, color: 'bg-green-500' },
                { label: 'Pending', value: stats.pendingOrders, color: 'bg-orange-400' },
                { label: 'Other', value: stats.totalOrders - stats.confirmedOrders - stats.pendingOrders, color: 'bg-blue-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="text-sm text-navy/70 dark:text-cream/70 flex-1">{s.label}</span>
                  <span className="text-sm font-bold text-navy dark:text-cream">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-navy-light rounded-2xl p-5 shadow-sm">
            <h3 className="font-serif font-semibold text-navy dark:text-cream mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Add New Product', to: '/admin/products', color: 'text-gold' },
                { label: 'View All Orders', to: '/admin/orders', color: 'text-blue-500' },
                { label: 'View Store', to: '/', color: 'text-green-500' },
              ].map(a => (
                <a key={a.label} href={a.to} className={`block text-sm ${a.color} hover:underline font-medium py-1`}>{a.label} →</a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
