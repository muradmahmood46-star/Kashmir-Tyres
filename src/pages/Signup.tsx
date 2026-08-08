import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const COMPANY_SIZES = ['1–50 employees', '51–250 employees', '251–1,000 employees', '1,000+ employees']
const INDUSTRIES = ['Financial Services', 'Healthcare', 'Government', 'Retail & E-commerce', 'Energy & Utilities', 'Manufacturing', 'Technology', 'Education', 'Other']

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', company: '', size: '', industry: '', phone: '',
  })

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const [error, setError] = useState('')

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (step === 1) {
      if (!form.email || !form.password || !form.firstName) {
        setError('Please fill in required fields.')
        return
      }
      setStep(2)
    } else {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: form.email, 
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
            company: form.company
          })
        })
        const data = await res.json()
        
        setLoading(false)
        if (!res.ok) {
          setError(data.error || 'Signup failed')
        } else {
          login(data.token, data.user)
          navigate('/')
        }
      } catch (err) {
        setLoading(false)
        setError('Network error. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-2/5 flex-col bg-gradient-to-br from-[#060e1f] via-[#0d1b35] to-[#1a2d5a] p-12 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="h-9 w-9 rounded-lg bg-[#10b981] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-white">CyberVault</span>
          </Link>
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-3xl font-semibold text-white mb-4 leading-tight">
            Join 4,200+<br />Enterprise Teams
          </h2>
          <p className="text-sm text-[#7c96cc] mb-10">Get access to our complete security platform with a 30-day free trial. No credit card required.</p>

          <div className="space-y-5">
            {[
              { step: '01', title: 'Create your account', desc: 'Personal + company details' },
              { step: '02', title: 'Configure your stack', desc: 'Choose your security solutions' },
              { step: '03', title: 'Deploy in minutes', desc: 'Guided onboarding + 24/7 support' },
            ].map((s, i) => (
              <div key={s.step} className={`flex items-start gap-4 ${i === 0 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-[#10b981] text-white' : 'border border-white/20 text-white/50'}`}>
                  {s.step}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{s.title}</p>
                  <p className="text-[11px] text-[#7c96cc] mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative mt-auto text-[11px] text-[#4a65ab]">© 2026 CyberVault · ISO 27001 · SOC2 Type II</p>
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-center bg-[#f8fafd] px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-[#dce5f4] bg-white p-8 shadow-sm">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1.5">
                {[1, 2].map((s) => (
                  <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? 'w-8 bg-[#1a2d5a]' : s < step ? 'w-4 bg-[#10b981]' : 'w-4 bg-[#dce5f4]'}`} />
                ))}
              </div>
              <span className="text-[11px] text-[#7c96cc]">Step {step} of 2</span>
            </div>

            <h1 style={{ fontFamily: 'Fraunces, serif' }} className="text-2xl font-semibold text-[#0d1b35] mb-1">
              {step === 1 ? 'Create your account' : 'Your organization'}
            </h1>
            <p className="text-sm text-[#7c96cc] mb-6">
              {step === 1 ? 'Set up your personal credentials.' : "Tell us about your company so we can tailor the right solution."}
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleNext} className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#213870]">First name</label>
                      <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Ahmad" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Last name</label>
                      <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Khan" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Work email</label>
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="example@gmail.com" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Password</label>
                    <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min. 12 characters" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                    {form.password.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${form.password.length >= i * 3 ? (form.password.length >= 12 ? 'bg-[#10b981]' : 'bg-amber-400') : 'bg-[#dce5f4]'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Phone (optional)</label>
                    <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+92 300 0000000" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Company name</label>
                    <input value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Meridian Financial Group" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Industry</label>
                    <select value={form.industry} onChange={(e) => update('industry', e.target.value)} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all">
                      <option value="">Select industry…</option>
                      {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Company size</label>
                    <div className="grid grid-cols-2 gap-2">
                      {COMPANY_SIZES.map((s) => (
                        <button
                          key={s} type="button"
                          onClick={() => update('size', s)}
                          className={`rounded-lg border py-2.5 text-xs font-medium transition-all ${form.size === s ? 'border-[#1a2d5a] bg-[#f0f4fb] text-[#1a2d5a]' : 'border-[#dce5f4] text-[#7c96cc] hover:border-[#b3c3e6]'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg border border-[#dce5f4] bg-[#f8fafd] p-3.5">
                    <input type="checkbox" id="terms" defaultChecked className="mt-0.5 h-3.5 w-3.5 rounded accent-[#1a2d5a]" />
                    <label htmlFor="terms" className="text-[11px] text-[#7c96cc] leading-relaxed">
                      I agree to CyberVault's{' '}
                      <a href="#" className="text-[#10b981] font-medium">Terms of Service</a> and{' '}
                      <a href="#" className="text-[#10b981] font-medium">Privacy Policy</a>. I understand my data will be processed in accordance with ISO 27001 standards.
                    </label>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-1">
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-lg border border-[#dce5f4] py-3 text-sm font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] hover:border-[#4a65ab]/40 active:scale-[0.98] transition-all duration-200">
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-[#1a2d5a] py-3 text-sm font-semibold text-white hover:bg-[#213870] hover:shadow-md hover:shadow-[#1a2d5a]/20 active:scale-[0.98] disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating account…
                    </>
                  ) : step === 1 ? 'Continue →' : 'Create Account'}
                </button>
              </div>
            </form>

            <p className="mt-5 text-center text-xs text-[#7c96cc]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#10b981] hover:text-[#047857] transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
