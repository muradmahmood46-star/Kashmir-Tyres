import { formatPrice } from '../../utils/formatPrice'
import { useState } from 'react'
import { useApp, type Bundle } from '../../context/AppContext'

function emptyBundle(): Omit<Bundle, 'id' | 'createdAt' | 'originalTotal'> {
  return {
    name: '', description: '', productIds: [], bundlePrice: 0,
    discountType: 'percent', discountValue: 0, badge: '', heroImage: '', active: true, isPopular: false, freeShipping: false,
  }
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=300&fit=crop&auto=format',
]

export default function BundlesAdmin() {
  const { bundles, addBundle, updateBundle, deleteBundle, getProductsInBundle, adminProducts: PRODUCTS } = useApp()
  const [form, setForm] = useState(emptyBundle())
  const [editing, setEditing] = useState<Bundle | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const computeOriginalTotal = (ids: number[]) =>
    PRODUCTS.filter((p) => ids.includes(p.id)).reduce((s, p) => s + p.price, 0)

  const autoBadge = (type: string, value: number) => {
    if (type === 'percent') return `${value}% OFF`
    if (type === 'flat') return `Flat $${value} OFF`
    return `Upto ${value}% OFF`
  }

  const toggleProduct = (id: number) => {
    setForm((prev) => {
      const ids = prev.productIds.includes(id)
        ? prev.productIds.filter((x) => x !== id)
        : [...prev.productIds, id]
      return { ...prev, productIds: ids }
    })
  }

  const handleSave = () => {
    if (!form.name.trim() || form.productIds.length < 2) return
    const originalTotal = computeOriginalTotal(form.productIds)
    const savings = originalTotal - form.bundlePrice
    const badge = savings > 0 ? `Save $${savings.toLocaleString()}` : 'Bundle Deal'
    if (editing) {
      updateBundle({ ...editing, ...form, originalTotal, badge })
    } else {
      addBundle({ id: `bun-${Date.now()}`, ...form, originalTotal, badge, createdAt: new Date().toISOString().split('T')[0] })
    }
    setForm(emptyBundle())
    setEditing(null)
    setShowForm(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const startEdit = (bundle: Bundle) => {
    setEditing(bundle)
    setForm({ name: bundle.name, description: bundle.description, productIds: bundle.productIds, bundlePrice: bundle.bundlePrice, discountType: bundle.discountType, discountValue: bundle.discountValue, badge: bundle.badge, heroImage: bundle.heroImage, active: bundle.active, isPopular: bundle.isPopular, freeShipping: bundle.freeShipping ?? false })
    setShowForm(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35]">Bundle Management</h2>
          <p className="text-xs text-[#7c96cc] mt-0.5">{bundles.filter(b => b.active).length} active bundles · Hero banner shows most recent active bundle</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="rounded-full bg-[#d1fae5] px-3 py-1 text-xs font-semibold text-[#047857]">✓ Saved</span>}
          <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyBundle()) }} className="flex items-center gap-1.5 rounded-lg bg-[#1a2d5a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#213870] transition-all">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Create Bundle
          </button>
        </div>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="rounded-xl border border-[#dce5f4] bg-white p-6 space-y-5">
          <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35]">{editing ? 'Edit Bundle' : 'Create New Bundle'}</h3>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Bundle Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Enterprise SOC Starter Pack" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
          </div>

          {/* Product picker */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#213870]">Select Products for Bundle * <span className="text-[#7c96cc] font-normal">(min. 2)</span></label>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 mb-4">
              {PRODUCTS.map((p) => {
                const selected = form.productIds.includes(p.id)
                return (
                  <button key={p.id} type="button" onClick={() => toggleProduct(p.id)} className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all ${selected ? 'border-[#1a2d5a] bg-[#f0f4fb]' : 'border-[#dce5f4] hover:border-[#b3c3e6]'}`}>
                    <img src={p.img} alt={p.name} className="h-10 w-12 rounded object-cover bg-[#f0f4fb] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[#0d1b35] line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-[#7c96cc]">{formatPrice(p.price.toLocaleString())}</p>
                    </div>
                    {selected && <div className="ml-auto h-4 w-4 rounded-full bg-[#10b981] flex items-center justify-center shrink-0"><svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>}
                  </button>
                )
              })}
            </div>
            
            {form.productIds.length >= 2 && (
              <div className="rounded-lg border border-[#dce5f4] bg-[#f8fafd] p-4">
                <div className="flex items-center gap-3 text-sm mb-4">
                  <span className="text-[#7c96cc]">Original total of selected products:</span>
                  <span className="font-semibold text-[#0d1b35]">{formatPrice(computeOriginalTotal(form.productIds).toLocaleString())}</span>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Set Bundle Price *</label>
                  <input type="number" value={form.bundlePrice || ''} onChange={(e) => setForm({ ...form, bundlePrice: Number(e.target.value) })} placeholder="e.g. 7999" className="w-full rounded-lg border border-[#dce5f4] bg-white px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                </div>
                {form.bundlePrice > 0 && (
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <span className="text-[#7c96cc]">Bundle discount:</span>
                    <span className="rounded-full bg-[#d1fae5] px-2 py-0.5 text-xs font-bold text-[#047857]">
                      Save ${(computeOriginalTotal(form.productIds) - form.bundlePrice).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Describe what's included and the value proposition…" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all resize-none" />
          </div>

          {/* Hero image */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Hero Background Images <span className="text-[#7c96cc] font-normal">(Max 2)</span></label>
            <div className="flex gap-2">
              <div className="relative flex-1 overflow-hidden rounded-lg border border-[#dce5f4] bg-[#f8fafd] hover:border-[#4a65ab] transition-all">
                <input type="file" accept="image/*" multiple onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(0, 2);
                  if (!files.length) return;
                  const readers = files.map(file => {
                    return new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result as string);
                      reader.readAsDataURL(file);
                    });
                  });
                  Promise.all(readers).then(images => {
                    setForm({ ...form, heroImage: JSON.stringify(images) });
                  });
                }} className="absolute inset-0 cursor-pointer opacity-0" />
                <button type="button" className="pointer-events-none flex h-full w-full items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#4a65ab]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                  Upload up to 2 Images
                </button>
              </div>
            </div>
            {form.heroImage && (
              <div className="mt-2 flex gap-2">
                {(form.heroImage.startsWith('[') ? JSON.parse(form.heroImage) : [form.heroImage]).map((img: string, i: number) => (
                  <div key={i} className="h-20 w-32 overflow-hidden rounded-lg border border-[#dce5f4] relative group">
                    <img src={img} alt="Preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => {
                      const current = form.heroImage.startsWith('[') ? JSON.parse(form.heroImage) : [form.heroImage];
                      const updated = current.filter((_: any, idx: number) => idx !== i);
                      setForm({ ...form, heroImage: updated.length ? JSON.stringify(updated) : '' });
                    }} className="absolute top-1 right-1 h-5 w-5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active + Popular toggles */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm({ ...form, active: !form.active })} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.active ? 'bg-[#10b981]' : 'bg-[#dce5f4]'}`}>
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-xs font-semibold text-[#213870]">{form.active ? 'Active — visible on storefront' : 'Inactive — hidden from storefront'}</span>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm({ ...form, isPopular: !form.isPopular })} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.isPopular ? 'bg-amber-400' : 'bg-[#dce5f4]'}`}>
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.isPopular ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-xs font-semibold text-[#213870]">🔥 Mark as Popular <span className="text-[#7c96cc] font-normal">(shows "Popular" ribbon on storefront)</span></span>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm({ ...form, freeShipping: !form.freeShipping })} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.freeShipping ? 'bg-[#10b981]' : 'bg-[#dce5f4]'}`}>
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.freeShipping ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-xs font-semibold text-[#213870]">🚚 Free Shipping <span className="text-[#7c96cc] font-normal">(shows free shipping badge on storefront)</span></span>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="rounded-lg border border-[#dce5f4] px-5 py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Cancel</button>
            <button onClick={handleSave} disabled={!form.name.trim() || form.productIds.length < 2} className="rounded-lg bg-[#10b981] px-5 py-2 text-xs font-semibold text-white hover:bg-[#047857] disabled:opacity-40 transition-all">{editing ? 'Update Bundle' : 'Create Bundle'}</button>
          </div>
        </div>
      )}

      {/* Bundle cards */}
      <div className="space-y-4">
        {bundles.map((bundle) => {
          const bundleProducts = getProductsInBundle(bundle)
          const isExpanded = expandedId === bundle.id
          const savings = bundle.originalTotal - bundle.bundlePrice

          return (
            <div key={bundle.id} className={`rounded-xl border overflow-hidden transition-all ${bundle.active ? 'border-[#dce5f4]' : 'border-[#dce5f4] opacity-60'} bg-white`}>
              {/* Hero preview */}
              {bundle.heroImage && (
                <div className="relative h-24 overflow-hidden">
                  <img src={bundle.heroImage.startsWith('[') ? JSON.parse(bundle.heroImage)[0] : bundle.heroImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b35]/80 to-[#0d1b35]/30" />
                  <div className="absolute inset-0 flex items-center px-5 gap-4">
                    <span className="rounded-full bg-[#10b981] px-3 py-1 text-[11px] font-bold text-white">{bundle.badge}</span>
                    {bundle.isPopular && <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-white">🔥 Popular</span>}
                    <span style={{ fontFamily: 'Fraunces, serif' }} className="text-white font-semibold text-base">{bundle.name}</span>
                    {!bundle.active && <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white font-semibold">Inactive</span>}
                  </div>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {!bundle.heroImage && <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35] mb-1">{bundle.name}</h3>}
                    <p className="text-xs text-[#7c96cc] line-clamp-1">{bundle.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="text-[#b3c3e6] line-through">{formatPrice(bundle.originalTotal.toLocaleString())}</span>
                      <span style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-bold text-[#0d1b35]">{formatPrice(bundle.bundlePrice.toLocaleString())}</span>
                      <span className="rounded-full bg-[#d1fae5] px-2 py-0.5 text-[10px] font-bold text-[#047857]">Save ${savings.toLocaleString()}</span>
                      <span className="text-[#7c96cc]">{bundle.productIds.length} products</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => updateBundle({ ...bundle, isPopular: !bundle.isPopular })} className={`rounded-lg border px-3 py-1.5 text-[10px] font-semibold transition-all ${bundle.isPopular ? 'border-amber-300 bg-amber-50 text-amber-600' : 'border-[#dce5f4] text-[#7c96cc] hover:bg-[#f0f4fb]'}`}>
                      {bundle.isPopular ? '🔥 Popular' : '☆ Set Popular'}
                    </button>
                    <button onClick={() => updateBundle({ ...bundle, active: !bundle.active })} className={`rounded-lg border px-3 py-1.5 text-[10px] font-semibold transition-all ${bundle.active ? 'border-amber-200 text-amber-600 hover:bg-amber-50' : 'border-[#d1fae5] text-[#047857] hover:bg-[#ecfdf5]'}`}>
                      {bundle.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => startEdit(bundle)} className="rounded-lg border border-[#dce5f4] px-3 py-1.5 text-[10px] font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Edit</button>
                    <button onClick={() => deleteBundle(bundle.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-all">Delete</button>
                    <button onClick={() => setExpandedId(isExpanded ? null : bundle.id)} className="rounded-lg border border-[#dce5f4] px-2.5 py-1.5 text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">
                      <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                  </div>
                </div>

                {/* Expanded product list */}
                {isExpanded && (
                  <div className="mt-4 border-t border-[#f0f4fb] pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#7c96cc] mb-3">Products in this bundle</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                      {bundleProducts.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 rounded-lg border border-[#f0f4fb] bg-[#f8fafd] p-2.5">
                          <img src={p.img} alt={p.name} className="h-10 w-12 rounded object-cover bg-[#f0f4fb] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-[#0d1b35] line-clamp-2 leading-tight">{p.name}</p>
                            <p className="text-[10px] text-[#10b981] font-semibold mt-0.5">{formatPrice(p.price.toLocaleString())}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
