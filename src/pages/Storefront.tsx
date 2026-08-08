import { formatPrice } from '../utils/formatPrice'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useApp } from '../context/AppContext'
import { SALE_THEMES } from '../data/saleThemes'
import { animateCardsOnScroll, animateCartButton } from '../utils/gsap'

function StarRating({ rating, reviews }: { rating: number; reviews?: number }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} className={`w-3.5 h-3.5 ${i <= full ? 'text-amber-400' : i === full + 1 && half ? 'text-amber-300' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {reviews !== undefined && <span className="text-xs text-[#7c96cc]">({reviews.toLocaleString()})</span>}
    </div>
  )
}

const badgeColor: Record<string, string> = {
  'Best Seller': 'bg-amber-100 text-amber-700',
  'New': 'bg-[#d1fae5] text-[#047857]',
  'Popular': 'bg-[#dce5f4] text-[#1a2d5a]',
  'Enterprise': 'bg-[#1a2d5a] text-white',
  'Sale': 'bg-red-100 text-red-700',
}

export default function Storefront() {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<number>(Number.POSITIVE_INFINITY)
  const [minRating, setMinRating] = useState(0)
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({})
  const [addedId, setAddedId] = useState<number | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sort, setSort] = useState('featured')
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist, bundles, getProductsInBundle, activeSaleBanner, adminProducts: PRODUCTS, categories, brands, heroStats, settings } = useApp()
  const CATEGORIES = ['All', ...categories.map(c => c.name)]
  const BRANDS = brands.map(b => b.name)
  const activeBundles = bundles.filter((b) => b.active)
  const saleAnnouncement = activeSaleBanner && 'occasionTheme' in activeSaleBanner ? activeSaleBanner : null
  const productsRef = useRef<HTMLDivElement>(null)

  const MAX_PRICE = PRODUCTS.length > 0 ? Math.ceil(Math.max(...PRODUCTS.map(p => p.price))) : 5000
  const MIN_PRICE = PRODUCTS.length > 0 ? Math.floor(Math.min(...PRODUCTS.map(p => p.price))) : 0
  const currentPriceRange = priceRange === Number.POSITIVE_INFINITY ? MAX_PRICE : priceRange

  const searchQuery = searchParams.get('q') || ''

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand])
  }

  // Collect all unique spec keys across all products
  const allSpecKeys = Array.from(new Set(PRODUCTS.flatMap((p) => Object.keys(p.specs))))

  // Collect unique values per spec key
  const specValues = (key: string) =>
    Array.from(new Set(PRODUCTS.map((p) => p.specs[key]).filter(Boolean)))

  const toggleSpec = (key: string, val: string) => {
    setSelectedSpecs((prev) => {
      const next = { ...prev }
      if (next[key] === val) delete next[key]
      else next[key] = val
      return next
    })
  }

  const handleAddToCart = (e: React.MouseEvent, product: (typeof PRODUCTS)[0]) => {
    e.preventDefault()
    addItem(product)
    setAddedId(product.id)
    animateCartButton(e.currentTarget as HTMLElement)
    setTimeout(() => setAddedId(null), 1400)
  }

  let filtered = PRODUCTS.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false
    if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false
    if (p.price > currentPriceRange) return false
    if (p.rating < minRating) return false
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.category.toLowerCase().includes(searchQuery.toLowerCase())) return false
    for (const [key, val] of Object.entries(selectedSpecs)) {
      if (!p.specs[key] || !p.specs[key].toLowerCase().includes(val.toLowerCase())) return false
    }
    return true
  })

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  else if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)

  useEffect(() => {
    if (productsRef.current) animateCardsOnScroll(productsRef.current)
  }, [filtered.length, selectedCategory, selectedBrands, priceRange, minRating, selectedSpecs, sort, searchQuery])

  const Sidebar = () => (
    <aside className="w-60 shrink-0 space-y-7">
      <div>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#7c96cc]">Category</h3>
        <div className="space-y-0.5">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all flex items-center justify-between ${selectedCategory === cat ? 'bg-[#1a2d5a] text-white' : 'text-[#213870] hover:bg-[#f0f4fb]'}`}>
              {cat}
              {selectedCategory === cat && <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#7c96cc]">Price Range</h3>
        <div className="px-1">
          <input type="range" min={MIN_PRICE} max={MAX_PRICE} step={1} value={currentPriceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-[#10b981]" />
          <div className="mt-1.5 flex justify-between text-xs font-medium text-[#4a65ab]">
            <span>{formatPrice(MIN_PRICE)}</span>
            <span className="text-[#1a2d5a] font-semibold">{formatPrice(currentPriceRange)}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#7c96cc]">Brand</h3>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2.5 group">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="h-4 w-4 rounded border-[#b3c3e6] accent-[#10b981]" />
              <span className="text-sm text-[#213870] group-hover:text-[#1a2d5a] transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#7c96cc]">Min. Rating</h3>
        <div className="space-y-1">
          {[0, 4, 4.5, 4.7].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 transition-all ${minRating === r ? 'bg-[#f0f4fb]' : 'hover:bg-[#f0f4fb]'}`}>
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className={`w-3.5 h-3.5 ${i <= (r || 5) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-[#4a65ab]">{r === 0 ? 'All' : `${r}+`}</span>
              {minRating === r && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#10b981]" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#7c96cc]">Specifications</h3>
        <div className="space-y-3">
          {allSpecKeys.map((key) => {
            const vals = specValues(key)
            if (vals.length < 2) return null
            return (
              <div key={key}>
                <p className="text-[10px] font-semibold text-[#213870] mb-1.5">{key}</p>
                <div className="flex flex-wrap gap-1">
                  {vals.map((v) => {
                    const active = selectedSpecs[key] === v
                    return (
                      <button
                        key={v}
                        onClick={() => toggleSpec(key, v)}
                        className={`rounded-md px-2 py-1 text-[10px] font-medium border transition-all ${active ? 'border-[#1a2d5a] bg-[#1a2d5a] text-white' : 'border-[#dce5f4] text-[#4a65ab] hover:border-[#4a65ab]'}`}
                      >
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {(selectedCategory !== 'All' || selectedBrands.length > 0 || currentPriceRange < MAX_PRICE || minRating > 0 || Object.keys(selectedSpecs).length > 0) && (
        <button onClick={() => { setSelectedCategory('All'); setSelectedBrands([]); setPriceRange(Number.POSITIVE_INFINITY); setMinRating(0); setSelectedSpecs({}) }} className="w-full rounded-lg border border-[#dce5f4] py-2 text-xs font-semibold text-[#4a65ab] hover:border-[#1a2d5a] hover:text-[#1a2d5a] transition-all">
          Clear All Filters
        </button>
      )}
    </aside>
  )

  return (
    <div className="min-h-screen bg-[#f8fafd]">
      {/* Hero banner */}
      <div className="relative px-6 py-10 overflow-hidden min-h-[300px] flex items-center">
        {settings?.bannerImage ? (
          <img src={settings.bannerImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b35] via-[#1a2d5a] to-[#213870]" />
        )}
        {settings?.bannerImage && <div className="absolute inset-0 bg-black/60" />}

        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-center justify-between w-full relative z-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#10b981] mb-2">{settings?.bannerLabel || 'Kashmir Tyres'}</p>
            <h1 style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-3xl font-black text-white leading-tight uppercase tracking-wider">
              {searchQuery ? `Results for "${searchQuery}"` : (
                <>
                  {settings?.bannerTitle ? (
                    <span className="text-white">{settings.bannerTitle}</span>
                  ) : (
                    <>GRIP THE ROAD. <span className="text-[#10b981]">OWN THE JOURNEY.</span></>
                  )}
                </>
              )}
            </h1>
            <p className="mt-1.5 text-sm text-[#e2e8f0]">{settings?.bannerSubtext || 'From city streets to mountain passes, every mile matters.'}</p>
          </div>
          {saleAnnouncement && (
            <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white shadow-lg shadow-[#00000033]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                {SALE_THEMES[saleAnnouncement.occasionTheme].icon}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/75">Current Promotion</p>
                <p className="text-sm font-semibold text-white">
                  {saleAnnouncement.discountPercent}% OFF {saleAnnouncement.name}
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-8 mt-6 md:mt-0">
            {heroStats.map((s) => (
              <div key={s.id || s.label} className="text-center">
                <div style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-2xl font-black text-[#10b981] uppercase">{s.value}</div>
                <div className="text-[10px] text-[#7c96cc] mt-0.5 font-semibold uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-8">
        {/* Mobile filter toggle */}
        <div className="mb-4 flex items-center justify-between md:hidden">
          <p className="text-sm font-medium text-[#4a65ab]">{filtered.length} products</p>
          <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="rounded-lg border border-[#dce5f4] px-4 py-2 text-sm font-medium text-[#1a2d5a] hover:bg-[#f0f4fb]">
            {mobileFiltersOpen ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {/* Bundles section */}
        {activeBundles.length > 0 && (
          <div id="bundles" className="mb-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#10b981] mb-1">Exclusive Deals</p>
                <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-2xl font-semibold text-[#0d1b35]">Bundles</h2>
              </div>
            </div>

            {activeBundles.map((bundle) => {
              const bundleProducts = getProductsInBundle(bundle)
              const savings = bundle.originalTotal - bundle.bundlePrice
              return (
                <div key={bundle.id} className="rounded-2xl border border-[#dce5f4] bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Bundle header — hero image or plain */}
                  <div className="relative h-40 overflow-hidden">
                    {bundle.heroImage ? (
                      <img src={bundle.heroImage.startsWith('[') ? JSON.parse(bundle.heroImage)[0] : bundle.heroImage} alt={bundle.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0d1b35] to-[#213870]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b35]/80 via-[#0d1b35]/50 to-transparent" />

                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="rounded-full bg-[#10b981] px-3 py-1 text-[11px] font-bold text-white shadow">{bundle.badge}</span>
                      {bundle.isPopular && (
                        <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold text-white shadow flex items-center gap-1">
                          🔥 Popular
                        </span>
                      )}
                    </div>

                    {/* Bundle name + price overlaid on hero */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-white leading-tight">{bundle.name}</h3>
                        <p className="text-xs text-white/70 mt-0.5 line-clamp-1">{bundle.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="flex items-baseline gap-2 justify-end">
                          <span className="text-xs text-white/50 line-through">{formatPrice(bundle.originalTotal.toLocaleString())}</span>
                          <span style={{ fontFamily: 'Fraunces, serif' }} className="text-2xl font-bold text-white">{formatPrice(bundle.bundlePrice.toLocaleString())}</span>
                        </div>
                        <p className="text-[11px] text-[#10b981] font-bold">Save ${savings.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Product cards grid */}
                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc] mb-3">{bundleProducts.length} products included</p>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-4">
                      {bundleProducts.map((p) => (
                        <Link to={`/products/${p.id}`} key={p.id} className="group/card rounded-xl border border-[#f0f4fb] bg-[#f8fafd] overflow-hidden hover:border-[#b3c3e6] hover:shadow-sm transition-all block">
                          <div className="relative h-24 overflow-hidden bg-[#f0f4fb]">
                            <img src={p.img} alt={p.name} className="h-full w-full object-cover group-hover/card:scale-105 transition-transform duration-300" />
                            {p.badge && (
                              <span className="absolute top-1.5 left-1.5 rounded-full bg-[#10b981] px-1.5 py-0.5 text-[8px] font-bold text-white">{p.badge}</span>
                            )}
                          </div>
                          <div className="p-2">
                            <p className="text-[10px] font-semibold text-[#0d1b35] line-clamp-2 leading-tight mb-1">{p.name}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-end gap-1">
                                <span style={{ fontFamily: 'Fraunces, serif' }} className="text-xs font-bold text-[#1a2d5a]">{formatPrice(p.price.toLocaleString())}</span>
                                {p.originalPrice && <span className="text-[9px] text-[#b3c3e6] line-through mb-0.5">{formatPrice(p.originalPrice.toLocaleString())}</span>}
                              </div>
                              <div className="flex">
                                {[1,2,3,4,5].map((s) => (
                                  <svg key={s} className={`w-2.5 h-2.5 ${s <= Math.round(p.rating) ? 'text-amber-400' : 'text-[#dce5f4]'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* CTA row */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#f0f4fb]">
                      <p className="text-xs text-[#7c96cc]">
                        {bundle.freeShipping && <span className="text-[#10b981] font-semibold mr-2">🚚 Free Shipping ·</span>}
                        <span className="text-[#10b981] font-semibold">Bundle saves ${savings.toLocaleString()}</span>
                      </p>
                      <button
                        onClick={() => bundleProducts.forEach((p) => addItem(p))}
                        className="flex items-center gap-2 rounded-lg bg-[#1a2d5a] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#213870] transition-all shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                        Add Entire Bundle to Cart
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex gap-8">
          {sidebarOpen && (
            <div className="hidden md:block sticky top-20 self-start">
              <Sidebar />
            </div>
          )}
          {mobileFiltersOpen && (
            <div className="md:hidden w-full mb-6 rounded-xl border border-[#dce5f4] bg-white p-5">
              <Sidebar />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden md:flex items-center gap-2 rounded-lg border border-[#dce5f4] px-3 py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] hover:border-[#4a65ab] transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
                <p className="text-sm text-[#7c96cc]">
                  <span className="font-semibold text-[#1a2d5a]">{filtered.length}</span> of {PRODUCTS.length} products
                </p>
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-[#dce5f4] bg-white px-3 py-2 text-sm text-[#213870] focus:outline-none focus:border-[#4a65ab]">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-12 w-12 rounded-full bg-[#f0f4fb] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#7c96cc]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" /></svg>
                </div>
                <p className="text-[#4a65ab] font-medium">No products match your filters</p>
                <p className="text-sm text-[#7c96cc] mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div ref={productsRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filtered.map((product) => (
                  <Link
                    to={`/products/${product.id}`}
                    key={product.id}
                    data-scroll-animate
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-[#dce5f4] bg-white shadow-sm hover:shadow-lg hover:shadow-[#1a2d5a]/5 hover:border-[#b3c3e6] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {product.badge && (
                      <span className={`absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeColor[product.badge]}`}>
                        {product.badge}
                      </span>
                    )}
                    <div className="relative h-44 bg-[#f0f4fb] overflow-hidden">
                      <img src={product.img} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b35]/10 to-transparent" />
                      <button
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id) }}
                        className="absolute top-2.5 right-2.5 rounded-full bg-white/90 p-1.5 shadow-sm hover:scale-110 transition-all"
                      >
                        <svg className={`w-4 h-4 transition-colors ${isWishlisted(product.id) ? 'text-red-500 fill-red-500' : 'text-[#b3c3e6] fill-transparent'}`} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </button>
                      <span className="absolute bottom-2 right-2 rounded-md bg-[#0d1b35]/70 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#10b981]">
                        {product.tag}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc]">{product.brand} · {product.category}</p>
                      <h3 style={{ fontFamily: 'Fraunces, serif' }} className="mb-2 text-sm font-semibold leading-snug text-[#0d1b35] line-clamp-2">{product.name}</h3>
                      <StarRating rating={product.rating} reviews={product.reviews} />
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? 'bg-[#10b981]' : 'bg-red-500'}`} />
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${product.inStock ? 'text-[#10b981]' : 'text-red-500'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                        {product.freeShipping && (
                          <div className="flex items-center gap-1 rounded bg-[#d1fae5] px-1.5 py-0.5 text-[#047857]">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                            <span className="text-[9px] font-bold uppercase tracking-wider">Free Delivery</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <div className="flex flex-col">
                          {product.originalPrice && (
                            <span className="text-[10px] font-bold text-red-500 line-through mb-0.5">{formatPrice(product.originalPrice.toLocaleString())}</span>
                          )}
                          <span style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-extrabold text-[#10b981] drop-shadow-sm">{formatPrice(product.price.toLocaleString())}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="flex items-center justify-center rounded-lg bg-[#f0f4fb] px-3 py-2 text-[11px] font-semibold text-[#1a2d5a] group-hover:bg-[#dce5f4] transition-all">
                            View Full
                          </span>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className={`rounded-lg px-3 py-2 text-[11px] font-semibold transition-all duration-200 ${addedId === product.id ? 'bg-[#10b981] text-white scale-95' : 'bg-[#1a2d5a] text-white hover:bg-[#213870] hover:shadow-md hover:shadow-[#1a2d5a]/20 active:scale-95'}`}
                          >
                            {addedId === product.id ? '✓' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
