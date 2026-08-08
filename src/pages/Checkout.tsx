import { formatPrice } from '../utils/formatPrice'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

type Step = 'shipping' | 'payment' | 'review' | 'success'

const STEPS = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
]

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('shipping')
  const [placing, setPlacing] = useState(false)
  const [shipping, setShipping] = useState({
    addressLabel: '', locationType: '🏠 Home',
    firstName: 'Ahmad', lastName: 'Khan', company: '',
    email: '', phone: '',
    address: '', city: '', state: '', fullAddress: '', country: 'Pakistan',
  })
  const [payment, setPayment] = useState({
    method: 'card', cardName: '', cardNum: '', expiry: '', cvv: '',
  })

  const shippingFee = total >= 500 ? 0 : 49
  const tax = Math.round(total * 0.08)
  const orderTotal = total + shippingFee + tax

  const [orderNum, setOrderNum] = useState<string>('')

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const res = await fetch('http://localhost:3001/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethod: payment.method === 'card' ? 'Credit Card' : payment.method === 'po' ? 'Purchase Order' : 'Wire Transfer',
          shippingAddress: shipping,
          contactName: `${shipping.firstName} ${shipping.lastName}`,
        })
      })
      if (!res.ok) throw new Error('Failed to checkout')
      
      const order = await res.json()
      setOrderNum(order.orderNumber)
      clearCart()
      setStep('success')
    } catch (err) {
      console.error(err)
      alert('Failed to place order. Please check your connection or cart.')
    } finally {
      setPlacing(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#f8fafd] flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          <div className="h-20 w-20 rounded-full bg-[#d1fae5] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#10b981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif' }} className="text-3xl font-semibold text-[#0d1b35] mb-3">Order Confirmed!</h1>
          <p className="text-[#7c96cc] mb-2">Your order <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="font-semibold text-[#1a2d5a]">{orderNum}</span> has been placed.</p>
          <p className="text-sm text-[#7c96cc] mb-8">A confirmation has been sent to <span className="font-medium text-[#4a65ab]">{shipping.email}</span>. Estimated delivery: 3–5 business days.</p>
          <div className="rounded-xl border border-[#dce5f4] bg-white p-5 mb-6 text-left space-y-2">
            {[
              ['Delivery address', `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}`],
              ['Estimated delivery', '3–5 business days'],
              ['Support', '24/7 via +1 (800) CYBERVAULT'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span className="text-[#7c96cc]">{k}</span>
                <span className="font-medium text-[#0d1b35] text-right max-w-[200px]">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="rounded-lg border border-[#dce5f4] px-5 py-2.5 text-sm font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] hover:border-[#4a65ab]/40 active:scale-[0.98] transition-all duration-200">Back to Home</Link>
            <Link to="/products" className="rounded-lg bg-[#1a2d5a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#213870] hover:shadow-md hover:shadow-[#1a2d5a]/20 active:scale-[0.98] transition-all duration-200">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step)

  return (
    <div className="min-h-screen bg-[#f8fafd]">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${i < stepIndex ? 'bg-[#10b981] text-white' : i === stepIndex ? 'bg-[#1a2d5a] text-white' : 'bg-[#dce5f4] text-[#7c96cc]'}`}>
                {i < stepIndex ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-xs font-semibold ${i === stepIndex ? 'text-[#1a2d5a]' : 'text-[#7c96cc]'}`}>{s.label}</span>
              {i < STEPS.length - 1 && <div className={`w-12 h-0.5 ${i < stepIndex ? 'bg-[#10b981]' : 'bg-[#dce5f4]'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3 space-y-4">
            {step === 'shipping' && (
              <div className="rounded-xl border border-[#dce5f4] bg-white p-6">
                <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35] mb-5">New Delivery Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[['First Name', 'firstName', 'Ahmad'], ['Last Name', 'lastName', 'Khan']].map(([label, key, ph]) => (
                      <div key={key}>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">{label}</label>
                        <input value={(shipping as any)[key]} onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })} placeholder={ph} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[['Email address', 'email', 'example@email.com']].map(([label, key, ph]) => (
                      <div key={key}>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">{label}</label>
                        <input type="email" value={(shipping as any)[key]} onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })} placeholder={ph} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                      </div>
                    ))}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Phone</label>
                      <input 
                        type="tel"
                        value={shipping.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 11)
                          setShipping({ ...shipping, phone: val })
                        }}
                        placeholder="0300 0000000"
                        className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" 
                      />
                      {shipping.phone.length > 0 && shipping.phone.length < 11 && (
                        <p className="mt-1 text-[10px] text-red-500 font-medium">Must be 11 digits</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Address Label</label>
                      <input value={(shipping as any).addressLabel} onChange={(e) => setShipping({ ...shipping, addressLabel: e.target.value })} placeholder="e.g. My Home, Office HQ" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Location Type</label>
                      <select value={(shipping as any).locationType} onChange={(e) => setShipping({ ...shipping, locationType: e.target.value })} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all">
                        {['🏠 Home', '🏢 Office', '🖥️ Datacenter', '🏭 Warehouse', '📍 Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Company</label>
                    <input value={(shipping as any).company} onChange={(e) => setShipping({ ...shipping, company: e.target.value })} placeholder="optional" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[['Street Address', 'address', 'Street No 3 / Muslim Street'], ['City', 'city', 'Islamabad']].map(([label, key, ph]) => (
                      <div key={key}>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">{label}</label>
                        <input value={(shipping as any)[key]} onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })} placeholder={ph} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#213870]">State / Province</label>
                    <input value={(shipping as any).state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} placeholder="Punjab / Sindh / AJK" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Full Address</label>
                    <textarea value={(shipping as any).fullAddress} onChange={(e) => setShipping({ ...shipping, fullAddress: e.target.value })} rows={2} placeholder="House No 178, Street 3, Bahria Town Phase 4, Islamabad" className="w-full resize-none rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                  </div>
                  {/* Shipping method */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-[#213870]">Shipping Method</label>
                    <div className="space-y-2">
                      {[['Standard (3–5 days)', total >= 500 ? 'FREE' : formatPrice(49)], ['Express (1–2 days)', formatPrice(149)], ['Overnight', formatPrice(299)]].map(([label, price]) => (
                        <label key={label} className="flex cursor-pointer items-center justify-between rounded-lg border border-[#dce5f4] p-3 hover:border-[#4a65ab] transition-all">
                          <div className="flex items-center gap-2.5">
                            <input type="radio" name="shipping" defaultChecked={label.startsWith('Standard')} className="accent-[#1a2d5a]" />
                            <span className="text-sm text-[#213870] font-medium">{label}</span>
                          </div>
                          <span className={`text-sm font-semibold ${price === 'FREE' ? 'text-[#10b981]' : 'text-[#0d1b35]'}`}>{price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              <button onClick={() => setStep('payment')} className="mt-5 w-full rounded-lg bg-[#1a2d5a] py-3 text-sm font-semibold text-white hover:bg-[#213870] hover:shadow-md hover:shadow-[#1a2d5a]/20 active:scale-[0.98] transition-all duration-200">
                Continue to Payment →
              </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="rounded-xl border border-[#dce5f4] bg-white p-6">
                <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35] mb-5">Payment Method</h2>
                <div className="flex gap-2 mb-5">
                  {[['card', 'Credit / Debit Card'], ['po', 'Purchase Order'], ['wire', 'Wire Transfer']].map(([val, label]) => (
                    <button key={val} onClick={() => setPayment({ ...payment, method: val })} className={`flex-1 rounded-lg border py-2.5 text-xs font-semibold transition-all ${payment.method === val ? 'border-[#1a2d5a] bg-[#f0f4fb] text-[#1a2d5a]' : 'border-[#dce5f4] text-[#7c96cc] hover:border-[#b3c3e6]'}`}>
                      {label}
                    </button>
                  ))}
                </div>

                {payment.method === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Name on card</label>
                      <input value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} placeholder="James Anderson" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Card number</label>
                      <input value={payment.cardNum} onChange={(e) => setPayment({ ...payment, cardNum: e.target.value })} placeholder="4242 4242 4242 4242" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Expiry date</label>
                        <input value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} placeholder="MM / YY" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">CVV</label>
                        <input value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} placeholder="•••" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
                      </div>
                    </div>
                  </div>
                )}

                {payment.method === 'po' && (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-[#f0f4fb] border border-[#dce5f4] p-4 text-sm text-[#4a65ab]">
                      Net-30 terms available for approved organizations. Provide your PO number below.
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Purchase Order Number</label>
                      <input placeholder="PO-2026-00142" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none transition-all" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
                    </div>
                  </div>
                )}

                {payment.method === 'wire' && (
                  <div className="rounded-lg border border-[#dce5f4] bg-[#f8fafd] p-4 space-y-2 text-xs">
                    <p className="font-semibold text-[#213870] mb-2">Wire Transfer Details</p>
                    {[['Bank', 'First Republic Bank'], ['Account Name', 'CyberVault Security LLC'], ['Account No.', '****4821'], ['Routing No.', '****7294'], ['SWIFT', 'FRBKUS6S']].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-[#7c96cc]">{k}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="font-medium text-[#0d1b35]">{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                  <div className="flex gap-3 mt-5">
                  <button onClick={() => setStep('shipping')} className="flex-1 rounded-lg border border-[#dce5f4] py-3 text-sm font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] hover:border-[#4a65ab]/40 active:scale-[0.98] transition-all duration-200">← Back</button>
                  <button onClick={() => setStep('review')} className="flex-1 rounded-lg bg-[#1a2d5a] py-3 text-sm font-semibold text-white hover:bg-[#213870] hover:shadow-md hover:shadow-[#1a2d5a]/20 active:scale-[0.98] transition-all duration-200">Review Order →</button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="rounded-xl border border-[#dce5f4] bg-white p-6">
                <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35] mb-5">Review Your Order</h2>
                <div className="space-y-3 mb-5">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex items-center gap-3 rounded-lg border border-[#dce5f4] p-3">
                      <img src={product.img} alt={product.name} className="h-14 w-14 rounded-lg object-cover bg-[#f0f4fb]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0d1b35] line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-[#7c96cc]">Qty: {qty}</p>
                      </div>
                      <p style={{ fontFamily: 'Fraunces, serif' }} className="text-sm font-bold text-[#0d1b35]">{formatPrice((product.price * qty).toLocaleString())}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-[#dce5f4] p-4 space-y-2 text-xs mb-5">
                  <div className="flex justify-between text-[#4a65ab]"><span>Shipping to</span><span className="text-right text-[#0d1b35] font-medium max-w-[220px]">{shipping.address}, {shipping.city}, {shipping.state}</span></div>
                  <div className="flex justify-between text-[#4a65ab]"><span>Payment</span><span className="text-[#0d1b35] font-medium capitalize">{payment.method === 'card' ? 'Credit Card' : payment.method === 'po' ? 'Purchase Order' : 'Wire Transfer'}</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('payment')} className="flex-1 rounded-lg border border-[#dce5f4] py-3 text-sm font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] hover:border-[#4a65ab]/40 active:scale-[0.98] transition-all duration-200">← Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 rounded-lg bg-[#10b981] py-3 text-sm font-semibold text-white hover:bg-[#047857] hover:shadow-lg hover:shadow-[#10b981]/25 active:scale-[0.98] disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {placing ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Placing Order…</>
                    ) : `Place Order · $${orderTotal.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[#dce5f4] bg-white p-5 sticky top-20">
              <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35] mb-4">Order Summary</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {items.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-center gap-2.5">
                    <div className="relative">
                      <img src={product.img} alt={product.name} className="h-10 w-10 rounded-lg object-cover bg-[#f0f4fb]" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#1a2d5a] text-[9px] font-bold text-white flex items-center justify-center">{qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#0d1b35] line-clamp-1">{product.name}</p>
                    </div>
                    <p className="text-xs font-semibold text-[#0d1b35] shrink-0">{formatPrice((product.price * qty).toLocaleString())}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#dce5f4] pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-[#4a65ab]"><span>Subtotal</span><span>{formatPrice(total.toLocaleString())}</span></div>
                <div className="flex justify-between text-[#4a65ab]"><span>Shipping</span><span className={shippingFee === 0 ? 'text-[#10b981] font-semibold' : ''}>{shippingFee === 0 ? 'FREE' : `$${shippingFee}`}</span></div>
                <div className="flex justify-between text-[#4a65ab]"><span>Tax (8%)</span><span>{formatPrice(tax.toLocaleString())}</span></div>
                <div className="flex justify-between font-semibold text-[#0d1b35] text-sm border-t border-[#dce5f4] pt-2">
                  <span>Total</span>
                  <span style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-bold">{formatPrice(orderTotal.toLocaleString())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
