import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SALE_THEMES } from '../data/saleThemes'

export default function SaleBanner() {
  const { activeSaleBanner } = useApp()
  const [dismissed, setDismissed] = useState(false)

  if (!activeSaleBanner || dismissed) return null

  const isAnnouncement = 'occasionTheme' in activeSaleBanner
  const theme = isAnnouncement ? SALE_THEMES[activeSaleBanner.occasionTheme] : SALE_THEMES.general
  const appliesToLabel = isAnnouncement
    ? (() => {
        const { type, value } = activeSaleBanner.appliesTo
        if (type === 'all') return 'All products'
        if (type === 'category') return `Category: ${value || 'Any'}`
        if (type === 'bundle') return `Bundle: ${value || 'Selected bundle'}`
        if (type === 'products') {
          return Array.isArray(value) ? `${value.length} selected products` : 'Selected products'
        }
        return 'All products'
      })()
    : null

  return (
    <div className="relative py-2.5 px-6 text-white" style={{ backgroundImage: theme.gradient }}>
      <div className="mx-auto max-w-[1440px] flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
            <span>{theme.icon}</span>
            <span>{theme.label}</span>
          </span>
          <p className="text-sm font-semibold text-white">
            {isAnnouncement ? (
              <>
                <span className="font-bold">{activeSaleBanner.discountPercent}% OFF</span> on{' '}
                <span className="italic">{activeSaleBanner.name}</span>
                {' '}— {appliesToLabel}
              </>
            ) : (
              <>
                <span className="font-bold">{activeSaleBanner.badge}</span> on{' '}
                <span className="italic">{activeSaleBanner.name}</span> Bundle
              </>
            )}
          </p>
        </div>

        <Link to="/products" className="rounded-full bg-white px-4 py-1 text-[11px] font-bold text-[#047857] hover:bg-[#d1fae5] transition-all shrink-0">
          Explore Deals →
        </Link>
      </div>
      <button onClick={() => setDismissed(true)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  )
}
