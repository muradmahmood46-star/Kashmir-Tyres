import { formatPrice } from '../utils/formatPrice'
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useApp } from '../context/AppContext'
import { SALE_THEMES } from '../data/saleThemes'
import Hero3DBackground from '../components/Hero3DBackground'
import { animateHeroEntrance, animateCardsOnScroll, animateCartButton } from '../utils/gsap'

const FEATURE_VARIANTS = [
  {
    iconCircle: 'bg-[#d1fae5] text-[#047857] group-hover:bg-gradient-to-br group-hover:from-[#10b981] group-hover:via-[#34d399] group-hover:to-[#2dd4bf] group-hover:text-white',
  },
  {
    iconCircle: 'bg-[#effaf5] text-[#047857] group-hover:bg-gradient-to-br group-hover:from-[#059669] group-hover:via-[#10b981] group-hover:to-[#2dd4bf] group-hover:text-white',
  },
  {
    iconCircle: 'bg-[#e0f2fe] text-[#0c4a6e] group-hover:bg-gradient-to-br group-hover:from-[#0ea5e9] group-hover:via-[#22d3ee] group-hover:to-[#14b8a6] group-hover:text-white',
  },
  {
    iconCircle: 'bg-[#f0fdfa] text-[#0f766e] group-hover:bg-gradient-to-br group-hover:from-[#14b8a6] group-hover:via-[#2dd4bf] group-hover:to-[#0ea5e9] group-hover:text-white',
  },
  {
    iconCircle: 'bg-[#e0f2fe] text-[#0c4a6e] group-hover:bg-gradient-to-br group-hover:from-[#0ea5e9] group-hover:via-[#22d3ee] group-hover:to-[#10b981] group-hover:text-white',
  },
  {
    iconCircle: 'bg-[#ecfdf5] text-[#047857] group-hover:bg-gradient-to-br group-hover:from-[#10b981] group-hover:via-[#34d399] group-hover:to-[#059669] group-hover:text-white',
  },
]

const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Genuine Products',
    desc: 'Every product is 100% authentic, sourced directly from trusted brands and suppliers — no compromises on quality.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: 'Fast & Reliable Delivery',
    desc: 'Quick nationwide shipping with real-time order tracking, so you always know where your order is.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Secure Payments',
    desc: 'Multiple safe payment options including cash on delivery, cards, and mobile wallets — your transactions are always protected.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    title: 'Easy Returns & Exchange',
    desc: 'Not satisfied? Enjoy hassle-free returns and exchanges within 7 days of delivery, no questions asked.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: 'Expert Support',
    desc: 'Our support team is available to help you choose the right product and answer any questions before or after purchase.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM6 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    title: 'Best Price Guarantee',
    desc: 'Competitive pricing on every product, with regular deals and discounts to give you the best value for your money.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Ahmed Khan',
    role: 'Verified Buyer',
    avatar: 'AK',
    text: "Ordered a pair of running shoes and they arrived in just 2 days, perfectly packaged. The quality is even better than what I expected from the photos. Definitely shopping here again!",
    rating: 5,
  },
  {
    name: 'Sana Fatima',
    role: 'Verified Buyer',
    avatar: 'SF',
    text: "I was skeptical about buying sports equipment online, but the product exactly matched the description. Customer support was also super helpful when I had questions about sizing.",
    rating: 5,
  },
  {
    name: 'Bilal Ahmed',
    role: 'Verified Buyer',
    avatar: 'BA',
    text: "Great prices and genuine products. I've ordered three times now and every single order has been smooth — from checkout to delivery. Highly recommend this store.",
    rating: 5,
  },
]


function StarFull() {
  return (
    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function StarRating({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-[#dce5f4]'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {reviews !== undefined && <span className="text-[10px] font-medium text-[#7c96cc]">({reviews})</span>}
    </div>
  )
}

function AutoSwipeGallery({ images, name }: { images: string[], name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [images.length])

  if (!images.length) return null

  return (
    <div className="h-44 bg-[#f0f4fb] overflow-hidden relative group">
      <div 
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="h-full w-full shrink-0">
            <img src={img} alt={name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-3 bg-[#10b981]' : 'w-1.5 bg-white/60'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Landing() {
  const { addItem } = useCart()
  const { bundles, trustedOrgs, heroStats, settings, activeSaleBanner, adminProducts: PRODUCTS } = useApp()
  const saleAnnouncement = activeSaleBanner && 'occasionTheme' in activeSaleBanner ? activeSaleBanner : null
  const saleHeroTheme = saleAnnouncement ? SALE_THEMES[saleAnnouncement.occasionTheme] : null

  const heroRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const popularRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

  const sliderItems = [null, ...(settings?.sliderImages || [])]
  const [currentSlide, setCurrentSlide] = useState(0)

  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#best-selling') {
      setTimeout(() => {
        document.getElementById('best-selling')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location.hash])

  useEffect(() => {
    animateHeroEntrance(heroRef.current!)
    if (featuresRef.current) animateCardsOnScroll(featuresRef.current)
    if (featuredRef.current) animateCardsOnScroll(featuredRef.current)
    if (popularRef.current) animateCardsOnScroll(popularRef.current)
    if (testimonialsRef.current) animateCardsOnScroll(testimonialsRef.current)
  }, [])

  useEffect(() => {
    if (sliderItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderItems.length)
    }, 2000) // 1 second visible, 1 second transition
    return () => clearInterval(interval)
  }, [sliderItems.length])

  const saleHeroHeadline = saleAnnouncement
    ? `${saleAnnouncement.discountPercent}% Off ${(() => {
        const { type, value } = saleAnnouncement.appliesTo
        if (type === 'all') return 'Everything'
        if (type === 'category' && typeof value === 'string') return `All ${value}`
        if (type === 'bundle') return 'Selected Bundle'
        if (type === 'products') return Array.isArray(value) ? `${value.length} Selected Products` : 'Selected Products'
        return 'Everything'
      })()}`
    : ''

  const saleHeroSubtext = saleAnnouncement
    ? `Limited time offer — upgrade your security stack for less.${saleAnnouncement.endDate ? ` Ends ${new Date(saleAnnouncement.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.` : ''}`
    : settings?.bannerSubtext || 'Round-the-clock monitoring by certified security analysts backed by AI-powered automation.'

  const saleHeroCtaLink = saleAnnouncement && saleAnnouncement.appliesTo.type === 'category' && typeof saleAnnouncement.appliesTo.value === 'string' && saleAnnouncement.appliesTo.value
    ? `/products?category=${encodeURIComponent(saleAnnouncement.appliesTo.value)}`
    : '/products'

  const saleHeroLabel = saleAnnouncement
    ? `${saleHeroTheme?.icon ?? ''} ${saleAnnouncement.name.toUpperCase()}`
    : settings?.bannerLabel || '24/7 Security Operations'

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: (typeof PRODUCTS)[0]) => {
    e.preventDefault()
    addItem(product)
    animateCartButton(e.currentTarget)
  }

  return (
    <div className="bg-[#f8fafd]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0d1b35]">
        {/* Auto sliding image background */}
        {settings?.sliderImages && settings.sliderImages.length > 0 && (
          <div className="absolute inset-0 overflow-hidden flex">
            <div 
              className="flex transition-transform duration-1000 ease-in-out" 
              style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
            >
              {sliderItems.map((img, i) => (
                <div key={i} className="w-screen shrink-0 h-full">
                  {img ? (
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060e1f] via-[#0d1b35]/70 to-[#0d1b35]/40 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-24 lg:py-32">
          <div ref={heroRef} className="max-w-3xl">
            {heroStats[0]?.value?.trim() && (
              <div data-hero-animate className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#10b981]">Trusted by {heroStats[0].value} {heroStats[0].label || 'Enterprise Organizations'}</span>
              </div>
            )}
            <h1 data-hero-animate style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6 uppercase tracking-wider">
              GRIP THE ROAD.<br />
              <span className="text-[#10b981]">OWN THE JOURNEY.</span>
            </h1>
            <p data-hero-animate className="text-lg text-[#b3c3e6] mb-10 max-w-2xl leading-relaxed">
              From city streets to mountain passes, Kashmir Tyres delivers durable, high-performance tyres backed by expert fitting and honest service — because every mile matters.
            </p>
            <div data-hero-animate className="flex flex-wrap gap-3">
              <Link to="/products" className="rounded-xl bg-[#10b981] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#047857] hover:shadow-lg hover:shadow-[#10b981]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#10b981]/20">
                Browse Top Products
              </Link>
              <Link to="/products" className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 backdrop-blur-sm">
                Request Demo
              </Link>
            </div>
            {saleAnnouncement && (
              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white shadow-lg shadow-[#00000033]">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                  {SALE_THEMES[saleAnnouncement.occasionTheme].icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">Current promotion</p>
                  <p className="text-sm font-semibold text-white">
                    {saleAnnouncement.discountPercent}% OFF {saleAnnouncement.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* Stats bar */}
      <section className="bg-[#060e1f] border-t border-white/10 pb-8">
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.id} className="text-center">
                <div style={{ fontFamily: 'Fraunces, serif' }} className="text-2xl font-semibold text-[#10b981]">{s.value}</div>
                <div className="text-xs text-[#7c96cc] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="border-b border-[#dce5f4] bg-white py-8">
        <div className="mx-auto max-w-[1440px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#1a2d5a] mb-6">Trusted by leading organizations</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {trustedOrgs.map((co) => (
              <div key={co.id} className="flex flex-col items-center gap-0.5">
                <span style={{ fontFamily: 'Fraunces, serif' }} className="text-sm font-semibold text-[#0d1b35] hover:text-[#0d1b35] transition-colors cursor-default">{co.name}</span>
                {co.industry && <span className="text-[9px] uppercase tracking-widest text-[#4a5c7a]">{co.industry}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="why-us" className="py-20 px-6">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#10b981] mb-3">WHY SHOP WITH US</p>
            <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-4xl font-semibold text-[#0d1b35] mb-4">
              Quality You Can Trust
            </h2>
            <p className="text-[#4a65ab] font-medium max-w-xl mx-auto">
              {"From product selection to doorstep delivery, we make sure every part of your shopping experience is smooth, secure, and reliable.".split(" ").map((word, i) => (
                <span 
                  key={i} 
                  className="inline-block opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]" 
                  style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                >
                  {word}&nbsp;
                </span>
              ))}
            </p>
          </div>
          <div ref={featuresRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, index) => {
              const variant = FEATURE_VARIANTS[index % FEATURE_VARIANTS.length]
              return (
                <div
                  key={f.title}
                  data-scroll-animate
                  className="group rounded-3xl border border-[#dce5f4] bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#10b981]/35 hover:bg-[#f7fff9] hover:shadow-[0_35px_80px_-50px_rgba(16,185,129,0.35)] hover:-translate-y-0.5"
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${variant.iconCircle} transition-all duration-300 shadow-sm shadow-[#10b981]/10`}> 
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-[#0d1b35]" style={{ fontFamily: 'Fraunces, serif' }}>{f.title}</h3>
                  <p className="text-sm text-[#4a5c7a] leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Hero image section */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative rounded-2xl overflow-hidden h-80 lg:h-96 bg-[#0d1b35]">
            <img
              src={settings?.bannerImage}
              alt="Security operations center"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b35] via-[#0d1b35]/60 to-transparent" />
            <div className="absolute inset-0 flex items-center px-10 lg:px-16">
              <div className="max-w-lg">
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: saleHeroTheme?.accentColor ?? '#10b981' }}
                >
                  {saleHeroLabel}
                </p>
                {saleAnnouncement && (
                  <div className="mb-4 h-1.5 w-20 rounded-full" style={{ backgroundImage: saleHeroTheme?.gradient }} />
                )}
                <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-3xl lg:text-4xl font-semibold text-white mb-4 leading-tight">
                  {saleAnnouncement ? saleHeroHeadline : (
                    <span className="whitespace-pre-wrap">{settings?.bannerTitle || 'Your Threats Never Sleep.\nNeither Do We.'}</span>
                  )}
                </h2>
                <p className="text-[#7c96cc] text-sm mb-6">
                  {saleHeroSubtext}
                </p>
                <Link
                  to={saleHeroCtaLink}
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold text-white hover:shadow-lg hover:shadow-[#00000033] transition-all"
                  style={saleAnnouncement ? { backgroundImage: saleHeroTheme?.gradient, backgroundColor: saleHeroTheme?.primaryColor } : { backgroundColor: '#10b981' }}
                >
                  {saleAnnouncement ? 'Shop the Sale' : 'Explore Top Products'}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section id="best-selling" className="bg-white py-20 px-6">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#10b981] mb-2">Top Products</p>
              <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-4xl font-semibold text-[#0d1b35]">Best-Selling Products</h2>
            </div>
            <Link to="/products" className="text-sm font-semibold text-[#4a65ab] hover:text-[#1a2d5a] transition-colors">
              View All Products →
            </Link>
          </div>
          <div ref={featuredRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.filter((p) => p.badge === 'Best Seller').map((p) => (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#dce5f4] bg-[#f8fafd] hover:shadow-lg hover:shadow-[#1a2d5a]/5 hover:border-[#b3c3e6] hover:-translate-y-0.5 transition-all duration-200"
              >
                {p.badge && (
                  <span className={`absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${p.badge === 'New' ? 'bg-[#d1fae5] text-[#047857]' : p.badge === 'Best Seller' ? 'bg-amber-100 text-amber-700' : 'bg-[#1a2d5a] text-white'}`}>
                    {p.badge}
                  </span>
                )}
                <AutoSwipeGallery images={[p.img, ...(p.gallery || [])].filter(Boolean)} name={p.name} />
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc] mb-1">{p.brand}</p>
                  <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-sm font-semibold text-[#0d1b35] leading-snug line-clamp-2 mb-2">{p.name}</h3>
                  <StarRating rating={p.rating} reviews={p.reviews} />
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${p.inStock ? 'bg-[#10b981]' : 'bg-red-500'}`} />
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${p.inStock ? 'text-[#10b981]' : 'text-red-500'}`}>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                    {p.freeShipping && (
                      <div className="flex items-center gap-1 rounded bg-[#d1fae5] px-1.5 py-0.5 text-[#047857]">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                        <span className="text-[9px] font-bold uppercase tracking-wider">Free Delivery</span>
                      </div>
                    )}
                  </div>
                  <div className="flex mt-auto items-center justify-between pt-3">
                    <div className="flex flex-col">
                      {p.originalPrice && (
                        <span className="text-[10px] font-bold text-red-500 line-through mb-0.5">{formatPrice(p.originalPrice.toLocaleString())}</span>
                      )}
                      <span style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-extrabold text-[#10b981] drop-shadow-sm">{formatPrice(p.price.toLocaleString())}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="flex items-center justify-center rounded-lg bg-[#f0f4fb] px-3 py-1.5 text-[11px] font-semibold text-[#1a2d5a] group-hover:bg-[#dce5f4] transition-all">
                        View Full
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, p)}
                        className="rounded-lg bg-[#1a2d5a] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#213870] hover:shadow-md hover:shadow-[#1a2d5a]/20 active:scale-95 transition-all duration-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular products */}
      <section className="bg-white pb-20 px-6">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#10b981] mb-2">Top Products</p>
              <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-4xl font-semibold text-[#0d1b35]">Most popular products</h2>
            </div>
            <Link to="/products" className="text-sm font-semibold text-[#4a65ab] hover:text-[#1a2d5a] transition-colors">
              View All Products →
            </Link>
          </div>
          <div ref={popularRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.filter((p) => p.badge === 'Popular').map((p) => (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#dce5f4] bg-[#f8fafd] hover:shadow-lg hover:shadow-[#1a2d5a]/5 hover:border-[#b3c3e6] hover:-translate-y-0.5 transition-all duration-200"
              >
                {p.badge && (
                  <span className={`absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${p.badge === 'New' ? 'bg-[#d1fae5] text-[#047857]' : p.badge === 'Best Seller' ? 'bg-amber-100 text-amber-700' : 'bg-[#1a2d5a] text-white'}`}>
                    {p.badge}
                  </span>
                )}
                <AutoSwipeGallery images={[p.img, ...(p.gallery || [])].filter(Boolean)} name={p.name} />
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc] mb-1">{p.brand}</p>
                  <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-sm font-semibold text-[#0d1b35] leading-snug line-clamp-2 mb-2">{p.name}</h3>
                  <StarRating rating={p.rating} reviews={p.reviews} />
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${p.inStock ? 'bg-[#10b981]' : 'bg-red-500'}`} />
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${p.inStock ? 'text-[#10b981]' : 'text-red-500'}`}>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                    {p.freeShipping && (
                      <div className="flex items-center gap-1 rounded bg-[#d1fae5] px-1.5 py-0.5 text-[#047857]">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                        <span className="text-[9px] font-bold uppercase tracking-wider">Free Delivery</span>
                      </div>
                    )}
                  </div>
                  <div className="flex mt-auto items-center justify-between pt-3">
                    <div className="flex flex-col">
                      {p.originalPrice && (
                        <span className="text-[10px] font-bold text-red-500 line-through mb-0.5">{formatPrice(p.originalPrice.toLocaleString())}</span>
                      )}
                      <span style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-extrabold text-[#10b981] drop-shadow-sm">{formatPrice(p.price.toLocaleString())}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="flex items-center justify-center rounded-lg bg-[#f0f4fb] px-3 py-1.5 text-[11px] font-semibold text-[#1a2d5a] group-hover:bg-[#dce5f4] transition-all">
                        View Full
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, p)}
                        className="rounded-lg bg-[#1a2d5a] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#213870] hover:shadow-md hover:shadow-[#1a2d5a]/20 active:scale-95 transition-all duration-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-[#f8fafd]">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#10b981] mb-3">Customer Stories</p>
            <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-4xl font-semibold text-[#0d1b35]">What Our Customers Say</h2>
          </div>
          <div ref={testimonialsRef} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} data-scroll-animate className="rounded-xl border border-[#dce5f4] bg-white p-6 hover:shadow-lg hover:shadow-[#1a2d5a]/5 hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => <StarFull key={i} />)}
                </div>
                <p className="text-sm text-[#4a65ab] leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1a2d5a] to-[#2a4690] flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0d1b35]">{t.name}</p>
                    <p className="text-[10px] text-[#7c96cc]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#0d1b35] to-[#1a2d5a] py-20 px-6">
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-4xl font-semibold text-white mb-4">
            Ready to Find Your Perfect Product?
          </h2>
          <p className="text-[#7c96cc] mb-8 max-w-lg mx-auto">
            Join thousands of happy customers who trust us for quality products, fast delivery, and unbeatable service.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/products" className="rounded-xl bg-[#10b981] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#047857] transition-all">
              Shop Now
            </Link>
            <Link to="/signup" className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060e1f] px-6 py-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-5 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 rounded-lg bg-[#1a2d5a] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <span style={{ fontFamily: 'Fraunces, serif' }} className="text-white font-semibold">{settings.orgName}</span>
              </div>
              <p className="text-xs text-[#4a65ab] leading-relaxed max-w-xs">Grip the Road.<br />Own the Journey.</p>
            </div>
            {[
              { heading: 'Products', links: ['Car Tyres', 'Bike Tyres', 'Commercial Vehicle Tyres', 'Wheel Accessories', 'Deals & Offers'] },
              { heading: 'Company', links: ['About Us', 'Our Stores', 'Careers', 'Blog', 'Contact Us'] },
              { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Return & Refund Policy', 'Shipping Policy'] },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#4a65ab] mb-3">{col.heading}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-xs text-[#7c96cc] hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col items-center justify-center gap-3 relative min-h-[40px]">
            <p className="text-[11px] text-[#4a65ab] sm:absolute sm:left-0">© {new Date().getFullYear()} {settings.orgName}. All rights reserved.</p>
            <p className="text-[11px] font-semibold text-orange-500 text-center">Designed and developed by Tamsal Technologies</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
