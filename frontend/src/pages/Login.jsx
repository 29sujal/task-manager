import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../utils/api'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Enter a valid email'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    setLoading(true)
    try {
      const { data } = await loginUser(form)
      login(data)
      toast.success(`Welcome back, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#11111b] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#89b4fa]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#cba6f7]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#181825] border border-[#313244] rounded-2xl p-10 animate-slide-up relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#89b4fa] to-[#cba6f7] flex items-center justify-center text-[#11111b] font-bold text-lg">
            ✓
          </div>
          <span className="text-xl font-extrabold text-[#cdd6f4] tracking-tight">Taskify</span>
        </div>

        <h1 className="text-2xl font-extrabold text-[#cdd6f4] tracking-tight mb-1">Welcome back</h1>
        <p className="text-sm text-[#a6adc8] mb-8">Sign in to continue to your workspace</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#a6adc8] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 bg-[#313244] border border-[#45475a] rounded-xl text-[#cdd6f4] placeholder-[#6c7086] text-sm font-medium outline-none focus:border-[#89b4fa] focus:ring-2 focus:ring-[#89b4fa]/10 transition-all"
            />
            {errors.email && <p className="text-xs text-[#f38ba8] mt-1.5">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#a6adc8] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-[#313244] border border-[#45475a] rounded-xl text-[#cdd6f4] placeholder-[#6c7086] text-sm font-medium outline-none focus:border-[#89b4fa] focus:ring-2 focus:ring-[#89b4fa]/10 transition-all"
            />
            {errors.password && <p className="text-xs text-[#f38ba8] mt-1.5">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#89b4fa] to-[#cba6f7] text-[#11111b] font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#a6adc8] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#89b4fa] font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
