import { formatPrice } from '../utils/formatPrice'
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useApp } from '../context/AppContext'
import { animateCartButton } from '../utils/gsap'

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} className={`w-4 h-4 ${i <= Math.floor(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-[#4a65ab] font-medium">{rating}</span>
      <span className="text-sm text-[#7c96cc]">({reviews.toLocaleString()} reviews)</span>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { adminProducts: PRODUCTS } = useApp()
  const product = PRODUCTS.find((p) => p.id === Number(id))
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-[#4a65ab] font-medium">Product not found.</p>
        <Link to="/products" className="text-sm text-[#10b981]">← Back to Products</Link>
      </div>
    )
  }

  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3)

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    for (let i = 0; i < qty; i++) addItem(product)
    setAdded(true)
    if (e) animateCartButton(e.currentTarget)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="bg-[#f8fafd] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#dce5f4]">
        <div className="mx-auto max-w-[1440px] px-6 py-3 flex items-center gap-2 text-xs">
          <Link to="/" className="text-[#7c96cc] hover:text-[#1a2d5a]">Home</Link>
          <span className="text-[#dce5f4]">/</span>
          <Link to="/products" className="text-[#7c96cc] hover:text-[#1a2d5a]">Products</Link>
          <span className="text-[#dce5f4]">/</span>
          <span className="text-[#4a65ab] font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-10">
        {/* Main section */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 mb-12">
          {/* Image */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-[#f0f4fb] aspect-[4/3] group">
              {(() => {
                const allImages = [product.img, ...(product.gallery || [])]
                return (
                  <>
                    <img src={allImages[currentImageIndex]} alt={product.name} className="w-full h-full object-cover" />
                    {allImages.length > 1 && (
                      <>
                        <button onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-[#1a2d5a] opacity-0 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 group-hover:opacity-100">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                        </button>
                        <button onClick={() => setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-[#1a2d5a] opacity-0 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 group-hover:opacity-100">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        </button>
                      </>
                    )}
                  </>
                )
              })()}
              {product.badge && (
                <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${product.badge === 'New' ? 'bg-[#d1fae5] text-[#047857]' : product.badge === 'Best Seller' ? 'bg-amber-100 text-amber-700' : product.badge === 'Sale' ? 'bg-red-100 text-red-700' : 'bg-[#1a2d5a] text-white'}`}>
                  {product.badge}
                </span>
              )}
              <span className="absolute bottom-4 right-4 rounded-lg bg-[#0d1b35]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#10b981]">
                {product.tag}
              </span>
            </div>
            {/* Thumbnail row */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[product.img, ...(product.gallery || [])].map((src, i) => (
                <button key={i} onClick={() => setCurrentImageIndex(i)} className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === currentImageIndex ? 'border-[#1a2d5a]' : 'border-[#dce5f4] hover:border-[#b3c3e6] opacity-70 hover:opacity-100'}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-[#f0f4fb] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#4a65ab]">{product.brand}</span>
              <span className="rounded-full bg-[#f0f4fb] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#4a65ab]">{product.category}</span>
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif' }} className="text-3xl font-semibold text-[#0d1b35] leading-tight mb-3">{product.name}</h1>
            <StarRating rating={product.rating} reviews={product.reviews} />

            <div className="mt-6 mb-6 flex items-end gap-3 rounded-2xl bg-gradient-to-r from-[#f0fdfa] to-white border border-[#10b981]/20 p-5 shadow-sm">
              <span style={{ fontFamily: 'Fraunces, serif' }} className="text-5xl font-extrabold text-[#059669] drop-shadow-sm">
                {formatPrice((product.price * qty).toLocaleString())}
              </span>
              {product.originalPrice && (
                <div className="mb-1.5 flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-500 mb-0.5">Sale</span>
                  <span className="text-xl text-[#94a3b8] line-through">{formatPrice((product.originalPrice * qty).toLocaleString())}</span>
                </div>
              )}
              <span className="mb-2 ml-auto text-sm font-semibold uppercase tracking-widest text-[#64748b]"></span>
            </div>

            {product.originalPrice && (
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-lg bg-[#d1fae5] px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-[#047857]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-[#047857]">
                  Save {formatPrice(((product.originalPrice - product.price) * qty).toLocaleString())} ({Math.round((1 - product.price / product.originalPrice) * 100)}% off)
                </span>
              </div>
            )}

            <p className="text-sm text-[#4a65ab] leading-relaxed mb-5">{product.description}</p>

            {/* Stock */}
            <div className={`mb-5 flex items-center gap-2 text-xs font-semibold ${product.stock > 10 ? 'text-[#047857]' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
              <span className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-[#10b981]' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'}`} />
              {product.stock > 10 ? `In Stock (${product.stock} units)` : product.stock > 0 ? `Low Stock — Only ${product.stock} left` : 'Out of Stock'}
            </div>

            {/* Qty + add to cart */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center rounded-lg border border-[#dce5f4] overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 text-[#4a65ab] hover:bg-[#f0f4fb] transition-all font-bold">−</button>
                <span className="w-12 text-center text-sm font-semibold text-[#0d1b35]">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2.5 text-[#4a65ab] hover:bg-[#f0f4fb] transition-all font-bold">+</button>
              </div>
              <button
                onClick={(e) => handleAddToCart(e)}
                disabled={!product.inStock}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-all duration-200 ${added ? 'bg-[#10b981] text-white' : 'bg-[#1a2d5a] text-white hover:bg-[#213870] hover:shadow-md hover:shadow-[#1a2d5a]/20 active:scale-95'} disabled:opacity-50`}
              >
                {added ? '✓ Added to Cart' : `Add ${qty > 1 ? `${qty} units` : 'to Cart'}`}
              </button>
              <button
                onClick={() => { handleAddToCart(); navigate('/cart') }}
                className="rounded-lg border border-[#1a2d5a] px-4 py-3 text-sm font-semibold text-[#1a2d5a] hover:bg-[#f0f4fb] hover:border-[#1a2d5a]/40 active:scale-95 transition-all duration-200"
              >
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className={`grid gap-2 ${product.freeShipping ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {[
                ...(product.freeShipping ? [{ icon: '🚚', label: 'Free Shipping', sub: 'Ships on us' }] : []),
                { icon: '🔒', label: 'Secure Checkout', sub: 'SSL encrypted' },
                { icon: '↩️', label: '30-Day Returns', sub: 'No questions asked' },
              ].map((b) => (
                <div key={b.label} className="rounded-lg border border-[#dce5f4] bg-[#f8fafd] p-2.5 text-center">
                  <div className="text-lg mb-1">{b.icon}</div>
                  <p className="text-[10px] font-semibold text-[#0d1b35]">{b.label}</p>
                  <p className="text-[9px] text-[#7c96cc]">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="rounded-xl border border-[#dce5f4] bg-white overflow-hidden mb-10">
          <div className="border-b border-[#dce5f4] px-6 py-4">
            <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#1a2d5a]">Overview</h2>
          </div>
          <div className="p-6 space-y-10">
            {/* Features & Box */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35] mb-4">Key Features</h3>
                <ul className="space-y-2.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d1fae5]">
                        <svg className="w-3 h-3 text-[#047857]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <span className="text-sm text-[#213870]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35] mb-4">What's in the Box</h3>
                <ul className="space-y-2 text-sm text-[#4a65ab]">
                  {[`1× ${product.name}`, 'Quick Start Guide', 'Rack Mounting Kit', 'Power Cable (IEC C13)', 'Enterprise Support Card', '3-Year Warranty Certificate'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-[#b3c3e6]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Specifications */}
            {Object.keys(product.specs).length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35] mb-4">Specifications</h3>
                <div className="max-w-2xl">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-[#f0f4fb]">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key}>
                          <td className="py-3 pr-6 font-semibold text-[#4a65ab] w-1/3">{key}</td>
                          <td className="py-3 text-[#0d1b35]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-2xl font-semibold text-[#0d1b35] mb-5">Related Products</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="group flex overflow-hidden rounded-xl border border-[#dce5f4] bg-white hover:shadow-lg hover:shadow-[#1a2d5a]/5 hover:border-[#b3c3e6] hover:-translate-y-0.5 transition-all duration-200">
                  <div className="h-24 w-24 shrink-0 bg-[#f0f4fb] overflow-hidden">
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3.5 flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc] mb-0.5">{p.brand}</p>
                    <p style={{ fontFamily: 'Fraunces, serif' }} className="text-xs font-semibold text-[#0d1b35] line-clamp-2 leading-snug">{p.name}</p>
                    <p className="mt-1.5 text-sm font-bold text-[#1a2d5a]">{formatPrice(p.price.toLocaleString())}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
