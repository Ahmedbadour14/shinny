import { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('shinny_admin_token')
    if (!token) navigate('/admin/login')
  }, [navigate])

  function logout() {
    localStorage.removeItem('shinny_admin_token')
    navigate('/admin/login')
  }

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/products', label: 'Products', icon: <Package size={18} /> },
    { to: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
  ]

  return (
    <div className="min-h-screen bg-cream/20 dark:bg-navy flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-navy dark:bg-black flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="flex items-center gap-2 px-4 h-16 border-b border-white/10">
          <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
            <span className="text-white font-serif font-bold text-sm">S</span>
          </div>
          {sidebarOpen && <span className="font-serif font-bold text-cream truncate">Shinny Admin</span>}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${location.pathname === item.to ? 'bg-gold text-white' : 'text-cream/60 hover:bg-white/10 hover:text-cream'}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="px-2 pb-4 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/60 hover:bg-white/10 hover:text-cream transition-colors text-sm">
            <span className="flex-shrink-0">🌐</span>
            {sidebarOpen && <span className="font-medium">View Site</span>}
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-navy-light border-b border-cream/30 dark:border-navy-lighter flex items-center px-4 gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-navy/50 dark:text-cream/50 hover:text-gold transition-colors">
            <Menu size={20} />
          </button>
          <div className="text-sm font-medium text-navy dark:text-cream capitalize">
            {location.pathname.split('/').pop()}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
