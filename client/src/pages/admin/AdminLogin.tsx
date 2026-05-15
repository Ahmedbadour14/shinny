import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@shinny.eg')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await axios.post('/api/admin/login', { email, password })
      localStorage.setItem('shinny_admin_token', data.token)
      navigate('/admin/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy dark:bg-black px-4">
      <div className="absolute inset-0 pattern-dots opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm"
      >
        <div className="bg-white dark:bg-navy-light rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center mx-auto mb-3 shadow-lg shadow-gold/30">
              <span className="text-white font-serif font-bold text-xl">S</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-navy dark:text-cream">Shinny Admin</h1>
            <p className="text-sm text-navy/50 dark:text-cream/50 mt-1">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-navy dark:text-cream mb-1 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 dark:text-cream/40" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field pl-9" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-navy dark:text-cream mb-1 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 dark:text-cream/40" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="input-field pl-9 pr-9" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 dark:text-cream/40">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-cream/30 dark:border-navy-lighter">
            <p className="text-xs text-center text-navy/40 dark:text-cream/40">
              Default: admin@shinny.eg / shinny@admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
