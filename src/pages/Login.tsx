import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch(`${import.meta.env.PROD ? '' : 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })
      const data = await res.json()
      
      setLoading(false)
      if (!res.ok) {
        setError(data.error || 'Login failed')
        } else {
          login(data.token, data.user)
          const role = data.user.role?.toLowerCase()
          if (role === 'admin' || role === 'super_admin') {
            navigate('/admin')
          } else {
            navigate('/')
          }
        }
    } catch (err) {
      setLoading(false)
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-gradient-to-br from-[#060e1f] via-[#0d1b35] to-[#1a2d5a] p-12 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#10b981]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10b981]">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-white">Kashmir Tyres</span>
          </Link>
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-4xl font-semibold text-white mb-4 leading-tight">
            Grip the Road.<br />Own the Journey.
          </h2>
          <p className="text-[#7c96cc] text-sm leading-relaxed mb-12 max-w-xs">
            Sign in to manage your tyre inventory, track orders, and keep your business rolling at full speed.
          </p>
          <div className="space-y-4">
            {[
              { icon: '🚗', title: 'Trusted Since Day One', desc: 'Serving thousands of customers across Kashmir' },
              { icon: '🏆', title: '100% Genuine Products', desc: 'Only authentic tyres from top global brands' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Quick dispatch with real-time order tracking' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-lg">{f.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-white">{f.title}</p>
                  <p className="text-[11px] text-[#7c96cc] mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mt-auto">
          <p className="text-[11px] text-[#4a65ab]">© 2026 Kashmir Tyres · Quality You Can Trust · Genuine Products</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-[#f8fafd] px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-[#1a2d5a] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35]">Kashmir Tyres</span>
          </div>

          <div className="rounded-2xl border border-[#dce5f4] bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h1 style={{ fontFamily: 'Fraunces, serif' }} className="text-2xl font-semibold text-[#0d1b35] mb-1">Welcome back</h1>
              <p className="text-sm text-[#7c96cc]">Sign in to your Kashmir Tyres account</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Username or Email</label>
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all"
                />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#213870]">Password</label>
                  <a href="#" className="text-xs text-[#10b981] hover:text-[#047857] font-medium transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••••"
                    className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 pr-10 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7c96cc] hover:text-[#4a65ab]">
                    {showPwd ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="h-3.5 w-3.5 rounded border-[#b3c3e6] accent-[#1a2d5a]" />
                <label htmlFor="remember" className="text-xs text-[#4a65ab]">Keep me signed in for 30 days</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1a2d5a] py-3 text-sm font-semibold text-white hover:bg-[#213870] hover:shadow-md hover:shadow-[#1a2d5a]/20 active:scale-[0.98] disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating…
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-5 relative flex items-center gap-3">
              <div className="flex-1 h-px bg-[#dce5f4]" />
              <span className="text-[11px] text-[#b3c3e6]">or continue with</span>
              <div className="flex-1 h-px bg-[#dce5f4]" />
            </div>
            <div className="mt-4">
              <button className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-[#dce5f4] py-2.5 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] hover:border-[#4a65ab]/40 active:scale-[0.98] transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-[#7c96cc]">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-[#10b981] hover:text-[#047857] transition-colors">
                Request access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
