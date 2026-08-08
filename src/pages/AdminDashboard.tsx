import { formatPrice } from '../utils/formatPrice'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp, ROLE_PERMISSIONS, type Role } from '../context/AppContext'
import UserManagement from './admin/UserManagement'
import OrdersPage from './admin/OrdersPage'
import Settings from './admin/Settings'
import CatalogAdmin from './admin/CatalogAdmin'
import BundlesAdmin from './admin/BundlesAdmin'
import AddProduct from './admin/AddProduct'
import AnnouncementsAdmin from './admin/AnnouncementsAdmin'

type NavId = 'dashboard' | 'users' | 'products' | 'bundles' | 'announcements' | 'orders' | 'catalog' | 'settings'

const ALL_NAV: { id: NavId; label: string; badge?: number; section?: string; requirePerm: string }[] = [
  { id: 'dashboard', label: 'Dashboard', requirePerm: 'viewReports' },
  { id: 'users', label: 'User Management', badge: 3, section: 'People', requirePerm: 'manageUsers' },
  { id: 'products', label: 'Products', section: 'Catalog', requirePerm: 'manageProducts' },
  { id: 'bundles', label: 'Bundles', section: 'Catalog', requirePerm: 'manageBundles' },
  { id: 'announcements', label: 'Announcements', section: 'Catalog', requirePerm: 'manageBundles' },
  { id: 'catalog', label: 'Categories & Brands', section: 'Catalog', requirePerm: 'manageCatalog' },
  { id: 'orders', label: 'Orders', badge: 7, section: 'Commerce', requirePerm: 'manageOrders' },
  { id: 'settings', label: 'Settings', section: 'System', requirePerm: 'manageSettings' },
]

const NAV_ICONS: Record<NavId, React.ReactNode> = {
  dashboard: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  users: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  products: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
  bundles: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
  catalog: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>,
  announcements: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" /></svg>,
  orders: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
  settings: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495-.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
}

const ROLE_LABELS: Record<Role, { label: string; color: string }> = {
  admin: { label: 'ADMIN', color: 'bg-[#f0f4fb] text-[#1a2d5a] border-[#b3c3e6]' },
  super_admin: { label: 'SUPER ADMIN', color: 'bg-[#f0f4fb] text-[#1a2d5a] border-[#b3c3e6]' },
  manager: { label: 'MANAGER', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  viewer: { label: 'VIEWER', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  customer: { label: 'CUSTOMER', color: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]' },
}



const orderStatusStyle: Record<string, string> = { Delivered: 'bg-[#d1fae5] text-[#047857]', Processing: 'bg-[#dce5f4] text-[#1a2d5a]', Shipped: 'bg-sky-100 text-sky-700', Pending: 'bg-amber-100 text-amber-700' }
const productStatusStyle: Record<string, string> = { Active: 'bg-[#d1fae5] text-[#047857]', 'Low Stock': 'bg-amber-100 text-amber-700', 'Out of Stock': 'bg-red-100 text-red-700' }

const TODAY = '2026-08-06'
const PRESET_DAYS = [3, 7, 10, 15, 20]

function daysBefore(days: number) {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

function OrdersOverview({ onNav }: { onNav: (id: NavId) => void }) {
  const { settings } = useApp()
  const token = localStorage.getItem('token') || ''
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [preset, setPreset] = useState<number | null>(7)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.PROD ? '' : 'http://localhost:3001'}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch orders')
        return r.json()
      })
      .then(data => {
        const formatted = data.map((d: any) => {
          const dObj = new Date(d.createdAt)
          const dateStr = settings.dateFormat === 'DD/MM/YYYY' ? `${String(dObj.getDate()).padStart(2, '0')}/${String(dObj.getMonth()+1).padStart(2, '0')}/${dObj.getFullYear()}` : dObj.toISOString().split('T')[0]
          return {
            id: d.orderNumber,
            client: JSON.parse(d.shippingAddress).company || 'Individual',
            amount: d.totalAmount,
            date: dateStr,
            status: d.status
          }
        })
        setAllOrders(formatted)
      })
      .catch(err => console.error(err))
  }, [token])

  const from = useCustom ? customFrom : preset ? daysBefore(preset) : ''
  const to = useCustom ? customTo : TODAY

  const filtered = allOrders.filter((o) => {
    if (!from) return true
    return o.date >= from && o.date <= to
  })

  const total     = filtered.length
  const pending   = filtered.filter((o) => o.status === 'Pending').length
  const shipped   = filtered.filter((o) => o.status === 'Shipped').length
  const delivered = filtered.filter((o) => o.status === 'Delivered').length
  const processing = filtered.filter((o) => o.status === 'Processing').length
  const revenue   = filtered.reduce((s, o) => s + o.amount, 0)

  const tiles = [
    { label: 'Total Orders',     value: total,      color: 'from-[#1a2d5a] to-[#213870]',   text: 'text-white' },
    { label: 'Pending',          value: pending,    color: 'from-amber-50 to-amber-100',     text: 'text-amber-700', border: 'border-amber-200' },
    { label: 'Processing',       value: processing, color: 'from-[#dce5f4] to-[#eef2fb]',   text: 'text-[#1a2d5a]', border: 'border-[#b3c3e6]' },
    { label: 'Shipped',          value: shipped,    color: 'from-sky-50 to-sky-100',         text: 'text-sky-700',  border: 'border-sky-200' },
    { label: 'Delivered',        value: delivered,  color: 'from-[#d1fae5] to-[#ecfdf5]',   text: 'text-[#047857]', border: 'border-[#a7f3d0]' },
  ]

  return (
    <div className="rounded-xl border border-[#dce5f4] bg-white shadow-sm overflow-hidden">
      {/* Header + filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#f0f4fb]">
        <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">Orders Overview</h2>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset buttons */}
          {PRESET_DAYS.map((d) => (
            <button
              key={d}
              onClick={() => { setPreset(d); setUseCustom(false) }}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${!useCustom && preset === d ? 'bg-[#1a2d5a] text-white' : 'border border-[#dce5f4] text-[#4a65ab] hover:bg-[#f0f4fb]'}`}
            >
              {d}d
            </button>
          ))}

          {/* Custom range toggle */}
          <button
            onClick={() => { setUseCustom(true); setPreset(null) }}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${useCustom ? 'bg-[#1a2d5a] text-white' : 'border border-[#dce5f4] text-[#4a65ab] hover:bg-[#f0f4fb]'}`}
          >
            Custom
          </button>

          {useCustom && (
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-2.5 py-1.5 text-[11px] text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
              />
              <span className="text-[#b3c3e6] text-xs">→</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-2.5 py-1.5 text-[11px] text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-5 divide-x divide-[#f0f4fb]">
        {tiles.map((t) => (
          <div key={t.label} className={`bg-gradient-to-b ${t.color} p-4 text-center`}>
            <p style={{ fontFamily: 'Fraunces, serif' }} className={`text-3xl font-bold ${t.text}`}>{t.value}</p>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mt-1 ${t.text} opacity-70`}>{t.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue + breakdown bar */}
      <div className="px-5 py-4 border-t border-[#f0f4fb]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#7c96cc]">
            {useCustom && customFrom && customTo
              ? `${customFrom} → ${customTo}`
              : preset ? `Last ${preset} days` : 'All time'
            } · {total} orders
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7c96cc]">Total revenue:</span>
            <span style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-bold text-[#0d1b35]">{formatPrice(revenue.toLocaleString())}</span>
          </div>
        </div>

        {/* Stacked status bar */}
        {total > 0 && (
          <div className="flex h-2.5 w-full overflow-hidden rounded-full gap-0.5">
            {delivered  > 0 && <div className="bg-[#10b981] rounded-full transition-all" style={{ width: `${(delivered/total)*100}%` }} title={`Delivered: ${delivered}`} />}
            {shipped    > 0 && <div className="bg-sky-400 rounded-full transition-all"   style={{ width: `${(shipped/total)*100}%` }} title={`Shipped: ${shipped}`} />}
            {processing > 0 && <div className="bg-[#4a65ab] rounded-full transition-all" style={{ width: `${(processing/total)*100}%` }} title={`Processing: ${processing}`} />}
            {pending    > 0 && <div className="bg-amber-400 rounded-full transition-all" style={{ width: `${(pending/total)*100}%` }} title={`Pending: ${pending}`} />}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2.5">
          {[
            { label: 'Delivered',   count: delivered,  color: 'bg-[#10b981]' },
            { label: 'Shipped',     count: shipped,    color: 'bg-sky-400' },
            { label: 'Processing',  count: processing, color: 'bg-[#4a65ab]' },
            { label: 'Pending',     count: pending,    color: 'bg-amber-400' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${l.color}`} />
              <span className="text-[10px] text-[#7c96cc]">{l.label} <span className="font-semibold text-[#4a65ab]">{l.count}</span></span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-end">
          <button onClick={() => onNav('orders')} className="text-xs font-semibold text-[#10b981] hover:text-[#047857] transition-colors">View all orders →</button>
        </div>
      </div>
    </div>
  )
}

function DashboardHome({ onNav }: { onNav: (id: NavId) => void }) {
  const token = localStorage.getItem('token') || ''
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const { bundles, adminProducts: PRODUCTS, settings } = useApp()
  const activeBundles = bundles.filter((b) => b.active)

  useEffect(() => {
    fetch(`${import.meta.env.PROD ? '' : 'http://localhost:3001'}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch orders')
        return r.json()
      })
      .then(data => {
        const formatted = data.slice(0, 5).map((d: any) => {
          const dObj = new Date(d.createdAt)
          const dateStr = settings.dateFormat === 'DD/MM/YYYY' ? `${String(dObj.getDate()).padStart(2, '0')}/${String(dObj.getMonth()+1).padStart(2, '0')}/${dObj.getFullYear()}` : dObj.toISOString().split('T')[0]
          return {
            id: d.orderNumber,
            client: JSON.parse(d.shippingAddress).company || 'Individual',
            amount: d.totalAmount,
            status: d.status,
            date: dateStr
          }
        })
        setRecentOrders(formatted)
      })
      .catch(err => console.error(err))
  }, [token])

  const KPI = [
    { label: 'Total Revenue', value: 'Rs 2,847,391', change: '+18.4%', positive: true },
    { label: 'Active Users', value: '12,847', change: '+6.2%', positive: true },
    { label: 'Pending Orders', value: '284', change: '-3.1%', positive: false },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {KPI.map((kpi, i) => (
          <div key={kpi.label} className={`relative overflow-hidden rounded-xl p-5 text-white shadow-sm ${i === 0 ? 'bg-gradient-to-br from-[#1a2d5a] to-[#213870]' : i === 1 ? 'bg-gradient-to-br from-[#132245] to-[#1a2d5a]' : 'bg-gradient-to-br from-[#060e1f] to-[#0d1b35]'}`}>
            <p className="text-[11px] font-semibold uppercase tracking-widest opacity-60 mb-2">{kpi.label}</p>
            <p style={{ fontFamily: 'Fraunces, serif' }} className="text-3xl font-semibold">{kpi.value}</p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${kpi.positive ? 'bg-[#10b981]' : 'bg-amber-500'}`}>{kpi.change}</span>
              <span className="text-[11px] opacity-50">vs. last month</span>
            </div>
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full opacity-10 bg-[#10b981]" />
          </div>
        ))}
      </div>

      {/* Active bundles summary */}
      {activeBundles.length > 0 && (
        <div className="rounded-xl border border-[#dce5f4] bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-sm font-semibold text-[#0d1b35]">Active Bundles on Storefront</h2>
            <button onClick={() => onNav('bundles')} className="text-xs font-semibold text-[#10b981] hover:text-[#047857]">Manage →</button>
          </div>
          <div className="flex gap-3">
            {activeBundles.map((b) => (
              <div key={b.id} className="flex items-center gap-2.5 rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3 py-2 min-w-0">
                <span className="rounded-full bg-[#d1fae5] px-2 py-0.5 text-[10px] font-bold text-[#047857] shrink-0">{b.badge}</span>
                <span className="text-xs font-medium text-[#0d1b35] truncate max-w-[150px]">{b.name}</span>
                <span style={{ fontFamily: 'Fraunces, serif' }} className="text-xs font-bold text-[#0d1b35] shrink-0">{formatPrice(b.bundlePrice.toLocaleString())}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="xl:col-span-3 rounded-xl border border-[#dce5f4] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#dce5f4]">
            <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">Product Management</h2>
            <button onClick={() => onNav('products')} className="text-xs font-semibold text-[#10b981]">View All →</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0f4fb] bg-[#f8fafd]">
                {['Product', 'Stock', 'Price', 'Status'].map((c) => (
                  <th key={c} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc]">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4fb]">
              {PRODUCTS.slice(0, 6).map((p) => {
                const status = p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'Active'
                return (
                  <tr key={p.id} className="hover:bg-[#f8fafd]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2"><img src={p.img} alt="" className="h-8 w-10 rounded object-cover bg-[#f0f4fb]" /><p className="text-xs font-semibold text-[#0d1b35] line-clamp-1 max-w-[140px]">{p.name}</p></div>
                    </td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5"><div className="h-1.5 w-10 rounded-full bg-[#f0f4fb] overflow-hidden"><div className={`h-full rounded-full ${p.stock === 0 ? 'bg-red-400' : p.stock < 10 ? 'bg-amber-400' : 'bg-[#10b981]'}`} style={{ width: `${Math.min(100, (p.stock / 150) * 100)}%` }} /></div><span className="text-xs text-[#213870]">{p.stock}</span></div></td>
                    <td className="px-4 py-3"><span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xs font-semibold">{formatPrice(p.price.toLocaleString())}</span></td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${productStatusStyle[status]}`}>{status}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="xl:col-span-2 rounded-xl border border-[#dce5f4] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#dce5f4]">
            <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">Recent Orders</h2>
            <button onClick={() => onNav('orders')} className="text-xs font-semibold text-[#10b981]">View All →</button>
          </div>
          <div className="divide-y divide-[#f0f4fb]">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[#f8fafd]">
                <div className="h-7 w-7 shrink-0 rounded-full bg-[#f0f4fb] flex items-center justify-center text-[#4a65ab] mt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-[#0d1b35] truncate">{o.client}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${orderStatusStyle[o.status]}`}>{o.status}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-[10px] text-[#7c96cc]">{o.id}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xs font-bold text-[#0d1b35]">{formatPrice(o.amount.toLocaleString())}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <OrdersOverview onNav={onNav} />
    </div>
  )
}

export default function AdminDashboard() {
  const { currentRole, settings } = useApp()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [activeNav, setActiveNav] = useState<NavId>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null
  }

  const permissions = ROLE_PERMISSIONS[currentRole]
  const visibleNav = ALL_NAV.filter((item) => permissions[item.requirePerm])

  const handleNav = (id: NavId) => {
    const item = ALL_NAV.find((n) => n.id === id)
    if (item && permissions[item.requirePerm]) setActiveNav(id)
  }

  // Group nav by section
  const sections: { label: string; items: typeof ALL_NAV }[] = []
  for (const item of visibleNav) {
    const sec = item.section || 'Main'
    let found = sections.find((s) => s.label === sec)
    if (!found) { found = { label: sec, items: [] }; sections.push(found) }
    found.items.push(item)
  }

  const roleInfo = ROLE_LABELS[currentRole]

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fc]">
      {/* Sidebar */}
      <aside className={`flex flex-col border-r border-white/10 bg-[#0d1b35] transition-all duration-200 shrink-0 ${sidebarOpen ? 'w-58' : 'w-16'}`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10b981]">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
          </div>
          {sidebarOpen && <span style={{ fontFamily: 'Fraunces, serif' }} className="text-white text-base font-semibold leading-none">{settings.orgName}</span>}
        </div>

        <nav className="overflow-y-auto py-4 px-2 space-y-4">
          {sections.map((section) => (
            <div key={section.label}>
              {sidebarOpen && section.label !== 'Main' && (
                <p className="mb-1 px-3 text-[9px] font-bold uppercase tracking-widest text-white/25">{section.label}</p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${activeNav === item.id ? 'bg-white/10 text-white' : 'text-[#7c96cc] hover:bg-white/5 hover:text-white'}`}
                  >
                    <span className="shrink-0">{NAV_ICONS[item.id]}</span>
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                    {item.badge && sidebarOpen && <span className="ml-auto rounded-full bg-[#10b981] px-1.5 py-0.5 text-[9px] font-bold text-white">{item.badge}</span>}
                    {item.badge && !sidebarOpen && <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#10b981] text-[8px] font-bold text-white flex items-center justify-center">{item.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3 space-y-2">

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#2a4690] to-[#10b981] flex items-center justify-center text-white text-xs font-bold">A</div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">Admin</p>
                <p className="text-[10px] text-[#7c96cc]">{ROLE_LABELS[currentRole].label}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-[#dce5f4] bg-white px-6 py-3.5 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-1.5 text-[#7c96cc] hover:bg-[#f0f4fb] hover:text-[#1a2d5a] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            </button>
            <div>
              <h1 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35] leading-none">
                {ALL_NAV.find((n) => n.id === activeNav)?.label}
              </h1>
              <p className="text-xs text-[#7c96cc] mt-0.5">Aug 5, 2026 · 09:42 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg border border-[#dce5f4] p-2 text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center">5</span>
            </button>
            <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1a2d5a] to-[#10b981] flex items-center justify-center text-white text-xs font-bold">SA</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {activeNav === 'dashboard' && <DashboardHome onNav={handleNav} />}
          {activeNav === 'users' && <UserManagement />}
          {activeNav === 'products' && <AddProduct onGoToCatalog={() => handleNav('catalog')} />}
          {activeNav === 'bundles' && <BundlesAdmin />}
          {activeNav === 'announcements' && <AnnouncementsAdmin />}
          {activeNav === 'catalog' && <CatalogAdmin />}
          {activeNav === 'orders' && <OrdersPage />}
          {activeNav === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  )
}
