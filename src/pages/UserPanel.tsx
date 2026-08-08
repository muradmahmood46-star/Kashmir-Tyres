import { formatPrice } from '../utils/formatPrice'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp, type Address } from '../context/AppContext'
import { useCart } from '../context/CartContext'

type Tab = 'wishlist' | 'orders' | 'addresses' | 'profile'

const MY_ORDERS = [
  { id: 'ORD-9837', date: '2026-08-02', status: 'Delivered', items: [1, 5], total: 7298 },
  { id: 'ORD-9801', date: '2026-07-14', status: 'Delivered', items: [7], total: 349 },
  { id: 'ORD-9762', date: '2026-06-28', status: 'Delivered', items: [3, 8], total: 1898 },
]

const ORDER_STATUS: Record<string, string> = {
  Delivered: 'bg-[#d1fae5] text-[#047857]',
  Shipped: 'bg-sky-100 text-sky-700',
  Processing: 'bg-[#dce5f4] text-[#1a2d5a]',
  Pending: 'bg-amber-100 text-amber-700',
}

const LOCATION_TYPES = ['Home', 'Office', 'Datacenter', 'Warehouse', 'Other']

function emptyAddress(): Omit<Address, 'id' | 'isDefault'> {
  return { label: '', locationType: '', firstName: '', lastName: '', company: '', address: '', city: '', state: '', zip: '', country: 'Pakistan', phone: '', fullAddress: '' }
}

export default function UserPanel() {
  const { wishlist, toggleWishlist, addresses, addAddress, deleteAddress, setDefaultAddress, adminProducts: PRODUCTS } = useApp()
  const { addItem } = useCart()
  const [tab, setTab] = useState<Tab>('wishlist')
  const [showAddrForm, setShowAddrForm] = useState(false)
  const [addrForm, setAddrForm] = useState(emptyAddress())
  const [addrSaved, setAddrSaved] = useState(false)

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.some((w) => w.productId === p.id))

  const handleSaveAddress = () => {
    if (!addrForm.firstName || !addrForm.address) return
    addAddress({ id: `addr-${Date.now()}`, ...addrForm, isDefault: addresses.length === 0 })
    setAddrForm(emptyAddress())
    setShowAddrForm(false)
    setAddrSaved(true)
    setTimeout(() => setAddrSaved(false), 1500)
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'wishlist', label: 'Wishlist', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
    { id: 'orders', label: 'My Orders', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg> },
    { id: 'addresses', label: 'Addresses', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg> },
    { id: 'profile', label: 'Profile', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafd]">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        {/* Profile header */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-[#dce5f4] bg-white p-5">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#1a2d5a] to-[#10b981] flex items-center justify-center text-white text-xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>AK</div>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35]">Ahmad Khan</h1>
            <p className="text-sm text-[#7c96cc]">example@gmail.com · Customer since Aug 2026</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Link to="/products" className="rounded-lg border border-[#dce5f4] px-4 py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Browse Products</Link>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar nav */}
          <nav className="w-44 shrink-0 space-y-0.5">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${tab === t.id ? 'bg-[#1a2d5a] text-white' : 'text-[#4a65ab] hover:bg-[#f0f4fb]'}`}>
                {t.icon}
                {t.label}
                {t.id === 'wishlist' && wishlist.length > 0 && (
                  <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold ${tab === t.id ? 'bg-white/20 text-white' : 'bg-[#f0f4fb] text-[#4a65ab]'}`}>{wishlist.length}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* ─── WISHLIST ─── */}
            {tab === 'wishlist' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35]">Wishlist <span className="text-[#7c96cc] text-base">({wishlist.length})</span></h2>
                </div>
                {wishlistProducts.length === 0 ? (
                  <div className="rounded-xl border border-[#dce5f4] bg-white p-16 text-center">
                    <div className="text-4xl mb-3">🤍</div>
                    <p className="text-[#4a65ab] font-medium">Your wishlist is empty</p>
                    <Link to="/products" className="mt-3 inline-block text-sm text-[#10b981] font-semibold hover:text-[#047857]">Browse Products →</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlistProducts.map((p) => {
                      const added = wishlist.find((w) => w.productId === p.id)
                      return (
                        <div key={p.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-[#dce5f4] bg-white hover:shadow-md transition-all">
                          <button onClick={() => toggleWishlist(p.id)} className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-1.5 shadow-sm hover:bg-red-50 transition-all">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
                          </button>
                          <Link to={`/products/${p.id}`} className="h-40 bg-[#f0f4fb] overflow-hidden">
                            <img src={p.img} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                          </Link>
                          <div className="flex flex-col flex-1 p-3.5">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc] mb-0.5">{p.brand}</p>
                            <Link to={`/products/${p.id}`}><h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-sm font-semibold text-[#0d1b35] line-clamp-2 mb-1 hover:text-[#1a2d5a]">{p.name}</h3></Link>
                            <p className="text-[10px] text-[#b3c3e6] mb-2">Added {added?.addedAt}</p>
                            <div className="mt-auto flex items-end justify-between gap-2">
                              <div className="flex flex-wrap items-end gap-1.5">
                                <span style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-bold text-[#0d1b35]">{formatPrice(p.price.toLocaleString())}</span>
                                {p.originalPrice && <span className="text-xs text-[#b3c3e6] line-through mb-0.5">{formatPrice(p.originalPrice.toLocaleString())}</span>}
                              </div>
                              <button onClick={() => addItem(p)} className="ml-auto rounded-lg bg-[#1a2d5a] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#213870] transition-all">Add to Cart</button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ─── ORDERS ─── */}
            {tab === 'orders' && (
              <div>
                <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35] mb-4">My Orders</h2>
                <div className="space-y-3">
                  {MY_ORDERS.map((order) => {
                    const orderProducts = PRODUCTS.filter((p) => order.items.includes(p.id))
                    return (
                      <div key={order.id} className="rounded-xl border border-[#dce5f4] bg-white p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xs font-semibold text-[#1a2d5a]">{order.id}</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${ORDER_STATUS[order.status]}`}>{order.status}</span>
                          </div>
                          <div className="text-right">
                            <p style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-bold text-[#0d1b35]">{formatPrice(order.total.toLocaleString())}</p>
                            <p className="text-[10px] text-[#7c96cc]">{order.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {orderProducts.map((p) => (
                            <div key={p.id} className="flex items-center gap-2 rounded-lg border border-[#f0f4fb] bg-[#f8fafd] px-2.5 py-1.5">
                              <img src={p.img} alt={p.name} className="h-7 w-9 rounded object-cover" />
                              <span className="text-[11px] font-medium text-[#0d1b35] max-w-[120px] truncate">{p.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="rounded-lg border border-[#dce5f4] px-3 py-1.5 text-[11px] font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Track Order</button>
                          <button className="rounded-lg border border-[#dce5f4] px-3 py-1.5 text-[11px] font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Download Invoice</button>
                          <button className="rounded-lg border border-[#dce5f4] px-3 py-1.5 text-[11px] font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Reorder</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ─── ADDRESSES ─── */}
            {tab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35]">Delivery Addresses</h2>
                  <div className="flex items-center gap-2">
                    {addrSaved && <span className="text-xs text-[#10b981] font-semibold">✓ Saved</span>}
                    <button onClick={() => setShowAddrForm(!showAddrForm)} className="flex items-center gap-1.5 rounded-lg bg-[#1a2d5a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#213870] transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      Add Address
                    </button>
                  </div>
                </div>

                {showAddrForm && (
                  <div className="mb-4 rounded-xl border border-[#dce5f4] bg-white p-5 space-y-4">
                    <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">New Delivery Address</h3>
                    <div className="grid grid-cols-2 gap-3">

                      {/* Address Label */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Address Label</label>
                        <input value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} placeholder="e.g. My Home, Office HQ" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                      </div>

                      {/* Location Type */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Location Type</label>
                        <div className="flex flex-wrap gap-1.5">
                          {LOCATION_TYPES.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setAddrForm({ ...addrForm, locationType: addrForm.locationType === t ? '' : t })}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${addrForm.locationType === t ? 'border-[#1a2d5a] bg-[#f0f4fb] text-[#1a2d5a]' : 'border-[#dce5f4] text-[#7c96cc] hover:border-[#b3c3e6]'}`}
                            >
                              {t === 'Home' ? '🏠' : t === 'Office' ? '🏢' : t === 'Datacenter' ? '🖥️' : t === 'Warehouse' ? '🏭' : '📍'} {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">First Name</label>
                        <input value={addrForm.firstName} onChange={(e) => setAddrForm({ ...addrForm, firstName: e.target.value })} placeholder="Ahmad" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Last Name</label>
                        <input value={addrForm.lastName} onChange={(e) => setAddrForm({ ...addrForm, lastName: e.target.value })} placeholder="Khan" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                      </div>

                      {/* Company — optional */}
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#213870]">Company <span className="text-[10px] font-normal text-[#b3c3e6]">optional</span></label>
                        <input value={addrForm.company} onChange={(e) => setAddrForm({ ...addrForm, company: e.target.value })} placeholder="" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Phone</label>
                        <input value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} placeholder="+92 300 0000000" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                      </div>

                      {/* Street Address */}
                      <div className="col-span-2">
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Street Address</label>
                        <input value={addrForm.address} onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })} placeholder="Street No 3 / Muslim Street" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                      </div>

                      {/* City */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">City</label>
                        <input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} placeholder="Islamabad" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                      </div>

                      {/* State */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">State / Province</label>
                        <input value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} placeholder="Punjab / Sindh / AJK" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                      </div>

                      {/* Full Address */}
                      <div className="col-span-2">
                        <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Full Address</label>
                        <input value={addrForm.fullAddress} onChange={(e) => setAddrForm({ ...addrForm, fullAddress: e.target.value })} placeholder="House No 178, Street 3, Bahria Town Phase 4, Islamabad" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                      </div>

                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setShowAddrForm(false)} className="rounded-lg border border-[#dce5f4] px-4 py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Cancel</button>
                      <button onClick={handleSaveAddress} className="rounded-lg bg-[#10b981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#047857] transition-all">Save Address</button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`rounded-xl border p-4 transition-all ${addr.isDefault ? 'border-[#1a2d5a] bg-[#f0f4fb]' : 'border-[#dce5f4] bg-white hover:border-[#b3c3e6]'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#4a65ab]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                          <span className="text-xs font-semibold text-[#1a2d5a]">{addr.label || 'Address'}</span>
                          {addr.locationType && <span className="rounded-full bg-[#f0f4fb] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#4a65ab]">{addr.locationType}</span>}
                          {addr.isDefault && <span className="rounded-full bg-[#1a2d5a] px-2 py-0.5 text-[9px] font-bold text-white">DEFAULT</span>}
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#0d1b35]">{addr.firstName} {addr.lastName}</p>
                      {addr.company && <p className="text-xs text-[#7c96cc]">{addr.company}</p>}
                      {addr.fullAddress
                        ? <p className="text-xs text-[#4a65ab] mt-1">{addr.fullAddress}</p>
                        : <><p className="text-xs text-[#4a65ab] mt-1">{addr.address}</p><p className="text-xs text-[#4a65ab]">{addr.city}{addr.state ? `, ${addr.state}` : ''}</p></>
                      }
                      {addr.phone && <p className="text-xs text-[#7c96cc] mt-1">{addr.phone}</p>}
                      <div className="mt-3 flex gap-2">
                        {!addr.isDefault && <button onClick={() => setDefaultAddress(addr.id)} className="rounded-lg border border-[#dce5f4] px-2.5 py-1 text-[10px] font-semibold text-[#4a65ab] hover:bg-white transition-all">Set Default</button>}
                        <button onClick={() => deleteAddress(addr.id)} className="rounded-lg border border-red-200 px-2.5 py-1 text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-all">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── PROFILE ─── */}
            {tab === 'profile' && (
              <div>
                <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35] mb-4">Account Settings</h2>
                <div className="rounded-xl border border-[#dce5f4] bg-white overflow-hidden">
                  <div className="border-b border-[#f0f4fb] px-5 py-4">
                    <p className="text-xs font-semibold text-[#213870]">Personal Information</p>
                  </div>
                  <div className="p-5 space-y-4">
                    {[
                      { label: 'First Name', defaultVal: 'Ahmad', placeholder: '', optional: false },
                      { label: 'Last Name', defaultVal: 'Khan', placeholder: '', optional: false },
                      { label: 'Email', defaultVal: '', placeholder: 'example@gmail.com', optional: false },
                      { label: 'Phone', defaultVal: '+92 300 0000000', placeholder: '', optional: false },
                      { label: 'Company', defaultVal: '', placeholder: '', optional: true },
                      { label: 'Job Title', defaultVal: '', placeholder: '', optional: true },
                    ].map(({ label, defaultVal, placeholder, optional }) => (
                      <div key={label} className="grid grid-cols-3 items-center">
                        <label className="text-xs font-semibold text-[#4a65ab] flex items-center gap-1">
                          {label}
                          {optional && <span className="text-[9px] font-normal text-[#b3c3e6]">optional</span>}
                        </label>
                        <input defaultValue={defaultVal} placeholder={placeholder} className="col-span-2 rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none transition-all" />
                      </div>
                    ))}
                    <div className="flex justify-end pt-2">
                      <button className="rounded-lg bg-[#1a2d5a] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#213870] transition-all">Save Changes</button>
                    </div>
                  </div>
                  <div className="border-t border-[#f0f4fb] px-5 py-4">
                    <p className="text-xs font-semibold text-[#213870] mb-3">Security</p>
                    <div className="flex gap-2">
                      <button className="rounded-lg border border-[#dce5f4] px-4 py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Change Password</button>
                      <button className="rounded-lg border border-[#dce5f4] px-4 py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Enable 2FA</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
