import { Link, useNavigate, useLocation } from 'react-router-dom'
import SaleBanner from './SaleBanner'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useApp } from '../context/AppContext'

const NAV_LINKS = [
  { label: 'Top Products', href: '/#best-selling' },
  { label: 'All Products', href: '/products' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'About', href: '/' },
]

export default function Navbar() {
  const { count } = useCart()
  const { wishlist, settings } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[#dce5f4] bg-white/95 backdrop-blur-sm">
      <SaleBanner />
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a2d5a]">
            <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35]">{settings.orgName}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 ml-2">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.href} className="text-sm font-medium text-[#4a65ab] hover:text-[#1a2d5a] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <form
          className="flex-1 max-w-md mx-auto hidden md:block"
          onSubmit={(e) => { e.preventDefault(); if (search.trim()) navigate(`/products?q=${search}`) }}
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <svg className="w-4 h-4 text-[#7c96cc]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
              </svg>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] py-2 pl-9 pr-4 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/10 transition-all"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
          <Link
            to="/account"
            className="relative rounded-lg border border-[#dce5f4] p-2 text-[#4a65ab] hover:bg-[#f0f4fb] hover:text-[#1a2d5a] hover:border-[#4a65ab]/40 active:scale-95 transition-all duration-200"
            title="My Account"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative rounded-lg border border-[#dce5f4] p-2 text-[#4a65ab] hover:bg-[#f0f4fb] hover:text-[#1a2d5a] hover:border-[#4a65ab]/40 active:scale-95 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#10b981] text-[9px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link to="/login" className="hidden sm:block rounded-lg border border-[#dce5f4] px-3.5 py-2 text-xs font-semibold text-[#1a2d5a] hover:bg-[#f0f4fb] hover:border-[#4a65ab]/40 active:scale-95 transition-all duration-200">
            Sign In
          </Link>
          <Link to="/signup" className="hidden sm:block rounded-lg bg-[#1a2d5a] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#213870] hover:shadow-md hover:shadow-[#1a2d5a]/20 active:scale-95 transition-all duration-200">
            Get Started
          </Link>
          <button className="lg:hidden p-2 text-[#4a65ab]" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-[#dce5f4] bg-white px-6 py-3 space-y-1">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.href} onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium text-[#4a65ab]">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center rounded-lg border border-[#dce5f4] py-2 text-xs font-semibold text-[#1a2d5a]">Sign In</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center rounded-lg bg-[#1a2d5a] py-2 text-xs font-semibold text-white">Get Started</Link>
          </div>
        </div>
      )}
    </header>
  )
}
