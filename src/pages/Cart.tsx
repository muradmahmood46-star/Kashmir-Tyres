import { formatPrice } from '../utils/formatPrice'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQty, total, count } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafd] flex flex-col items-center justify-center gap-5 px-6">
        <div className="h-20 w-20 rounded-full bg-[#f0f4fb] flex items-center justify-center">
          <svg className="w-9 h-9 text-[#b3c3e6]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-2xl font-semibold text-[#0d1b35] mb-2">Your cart is empty</h2>
          <p className="text-sm text-[#7c96cc]">Browse our enterprise security solutions and add items to your cart.</p>
        </div>
        <Link to="/products" className="rounded-xl bg-[#1a2d5a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#213870] hover:shadow-lg hover:shadow-[#1a2d5a]/20 active:scale-[0.98] transition-all duration-200">
          Browse Products
        </Link>
      </div>
    )
  }

  const shipping = total >= 500 ? 0 : 49
  const tax = Math.round(total * 0.08)
  const orderTotal = total + shipping + tax

  return (
    <div className="min-h-screen bg-[#f8fafd]">
      <div className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 style={{ fontFamily: 'Fraunces, serif' }} className="text-2xl font-semibold text-[#0d1b35]">
            Shopping Cart <span className="text-[#7c96cc] text-lg">({count} {count === 1 ? 'item' : 'items'})</span>
          </h1>
          <Link to="/products" className="text-sm text-[#4a65ab] hover:text-[#1a2d5a] transition-colors">← Continue Shopping</Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-4 rounded-xl border border-[#dce5f4] bg-white p-4 hover:shadow-md hover:shadow-[#1a2d5a]/5 hover:border-[#b3c3e6] transition-all duration-200">
                <Link to={`/products/${product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f0f4fb]">
                  <img src={product.img} alt={product.name} className="h-full w-full object-cover hover:scale-105 transition-transform" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc] mb-0.5">{product.brand} · {product.category}</p>
                      <Link to={`/products/${product.id}`}>
                        <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-sm font-semibold text-[#0d1b35] leading-snug hover:text-[#1a2d5a] line-clamp-2">{product.name}</h3>
                      </Link>
                    </div>
                    <button onClick={() => removeItem(product.id)} className="shrink-0 rounded-lg p-1.5 text-[#b3c3e6] hover:bg-red-50 hover:text-red-400 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-[#dce5f4] overflow-hidden">
                      <button onClick={() => updateQty(product.id, qty - 1)} className="px-2.5 py-1.5 text-[#4a65ab] hover:bg-[#f0f4fb] text-sm font-bold transition-all">−</button>
                      <span className="w-8 text-center text-sm font-semibold text-[#0d1b35]">{qty}</span>
                      <button onClick={() => updateQty(product.id, qty + 1)} className="px-2.5 py-1.5 text-[#4a65ab] hover:bg-[#f0f4fb] text-sm font-bold transition-all">+</button>
                    </div>
                    <div className="text-right">
                      <p style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-bold text-[#0d1b35]">{formatPrice((product.price * qty).toLocaleString())}</p>
                      {qty > 1 && <p className="text-[11px] text-[#7c96cc]">Rs {product.price.toLocaleString()} each</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo */}
            <div className="rounded-xl border border-[#dce5f4] bg-white p-4">
              <h3 className="text-xs font-semibold text-[#213870] mb-3">Promo Code / Purchase Order</h3>
              <div className="flex gap-2">
                <input placeholder="Enter code or PO number…" className="flex-1 rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none transition-all" />
                <button className="rounded-lg border border-[#1a2d5a] px-4 py-2 text-xs font-semibold text-[#1a2d5a] hover:bg-[#f0f4fb] transition-all">Apply</button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="rounded-xl border border-[#dce5f4] bg-white p-5 sticky top-20">
              <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35] mb-4">Order Summary</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-[#4a65ab]">
                  <span>Subtotal ({count} items)</span>
                  <span className="font-medium text-[#0d1b35]">{formatPrice(total.toLocaleString())}</span>
                </div>
                <div className="flex justify-between text-[#4a65ab]">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-[#10b981]' : 'text-[#0d1b35]'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#4a65ab]">
                  <span>Tax (8%)</span>
                  <span className="font-medium text-[#0d1b35]">{formatPrice(tax.toLocaleString())}</span>
                </div>
                <div className="border-t border-[#dce5f4] pt-2.5 flex justify-between">
                  <span className="font-semibold text-[#0d1b35]">Order Total</span>
                  <span style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-bold text-[#0d1b35]">{formatPrice(orderTotal.toLocaleString())}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-700">
                  Add ${(500 - total).toLocaleString()} more for free shipping
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="mt-4 w-full rounded-lg bg-[#10b981] py-3.5 text-sm font-semibold text-white hover:bg-[#047857] hover:shadow-lg hover:shadow-[#10b981]/25 active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                Proceed to Checkout →
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="mt-2 w-full rounded-lg border border-[#dce5f4] py-2.5 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] hover:border-[#4a65ab]/40 active:scale-[0.98] transition-all duration-200"
              >
                Request a Quote (PO)
              </button>

              <div className="mt-4 space-y-2">
                {['SSL Encrypted Checkout', 'Net-30 Payment Terms Available', 'Volume Discounts for 10+ units'].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-[11px] text-[#7c96cc]">
                    <svg className="w-3.5 h-3.5 text-[#10b981] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
