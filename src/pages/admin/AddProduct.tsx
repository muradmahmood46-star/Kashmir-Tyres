import { formatPrice } from '../../utils/formatPrice'
import { useState } from 'react'
import { compressImage } from '../../utils/imageCompressor'
import { useApp, type AdminProduct } from '../../context/AppContext'

// removed sample imgs

type FormState = {
  name: string; category: string; categoryId: string; brand: string; brandId: string
  price: string; originalPrice: string; stock: string; tag: string; description: string
  badge: string; img: string; gallery: string[]; inStock: boolean; freeShipping: boolean
  features: string[]; specValues: Record<string, string>; rating: number
}

function emptyForm(): FormState {
  return {
    name: '', category: '', categoryId: '', brand: '', brandId: '',
    price: '', originalPrice: '', stock: '', tag: '', description: '',
    badge: '', img: '', gallery: [], inStock: true, freeShipping: false, features: ['', '', ''], specValues: {}, rating: 4.5,
  }
}

const BADGE_OPTIONS = ['', 'New', 'Best Seller', 'Popular', 'Enterprise', 'Sale']

export default function AddProduct({ onGoToCatalog }: { onGoToCatalog?: () => void }) {
  const { categories, brands, specTemplates, adminProducts, addAdminProduct, updateAdminProduct, deleteAdminProduct } = useApp()
  const [form, setForm] = useState<FormState>(emptyForm())
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [searchQ, setSearchQ] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [selectedSpecIds, setSelectedSpecIds] = useState<string[]>([])

  const relevantSpecs = specTemplates.filter((s) => !s.category || s.category === form.category)

  const handleSave = () => {
    if (!form.name.trim()) return
    const product: AdminProduct = {
      id: editing ? editing.id : Date.now(),
      name: form.name,
      category: form.category,
      categoryId: form.categoryId,
      brand: form.brand,
      brandId: form.brandId,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: Number(form.stock) || 0,
      rating: form.rating,
      reviews: editing ? editing.reviews : 0,
      badge: form.badge || undefined,
      img: form.img,
      gallery: form.gallery,
      tag: form.tag,
      description: form.description,
      features: form.features.filter(Boolean),
      specs: form.specValues,
      specifications: form.specValues,
      inStock: form.inStock,
      freeShipping: form.freeShipping,
    }
    if (editing) {
      updateAdminProduct(product)
    } else {
      addAdminProduct(product)
    }
    setForm(emptyForm())
    setEditing(null)
    setShowForm(false)
    setSelectedSpecIds([])
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const startEdit = (p: AdminProduct) => {
    setEditing(p)
    const specs = p.specs || {}
    setForm({
      name: p.name, category: p.category, categoryId: p.categoryId,
      brand: p.brand, brandId: p.brandId,
      price: String(p.price), originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      stock: String(p.stock), tag: p.tag, description: p.description,
      badge: p.badge || '', img: p.img, inStock: p.inStock, freeShipping: p.freeShipping ?? false,
      features: [...p.features, '', '', ''].slice(0, Math.max(3, p.features.length + 1)),
      specValues: specs,
      rating: p.rating || 4.5,
    })
    // pre-select specs that already have values
    const preSelected = specTemplates.filter((s) => specs[s.name]).map((s) => s.id)
    setSelectedSpecIds(preSelected)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    deleteAdminProduct(id)
    setDeleteConfirm(null)
  }

  const setFeature = (idx: number, val: string) => {
    setForm((prev) => {
      const features = [...prev.features]
      features[idx] = val
      if (idx === features.length - 1 && val) features.push('')
      return { ...prev, features }
    })
  }

  const allProducts = [...adminProducts].filter((p) => {
    const q = searchQ.toLowerCase()
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    const matchCat = !filterCat || p.category === filterCat
    return matchQ && matchCat
  })
  const statusOf = (p: AdminProduct) => p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'Active'
  const statusStyle: Record<string, string> = { Active: 'bg-[#d1fae5] text-[#047857]', 'Low Stock': 'bg-amber-100 text-amber-700', 'Out of Stock': 'bg-red-100 text-red-700' }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35]">Products</h2>
          <p className="text-xs text-[#7c96cc] mt-0.5">{allProducts.length} products · categories and brands from Catalog</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="rounded-full bg-[#d1fae5] px-3 py-1 text-xs font-semibold text-[#047857]">✓ Saved</span>}
          <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm()) }} className="flex items-center gap-1.5 rounded-lg bg-[#1a2d5a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#213870] transition-all">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className={`rounded-xl border bg-white p-6 space-y-5 ${editing ? 'border-[#4a65ab] ring-2 ring-[#1a2d5a]/10' : 'border-[#dce5f4]'}`}>
          <div className="flex items-center gap-3">
            {editing && <span className="rounded-full bg-[#dce5f4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1a2d5a]">Editing</span>}
            <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35]">{editing ? `Edit: ${editing.name}` : 'Add New Product'}</h3>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Product Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. SecureNet ProFirewall X9" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
            </div>

            {/* Category from list */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold text-[#213870]">Category</label>
                {onGoToCatalog && (
                  <button type="button" onClick={onGoToCatalog} className="flex items-center gap-1 text-[10px] font-semibold text-[#10b981] hover:text-[#047857] transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Add Category
                  </button>
                )}
              </div>
              <select
                value={form.categoryId}
                onChange={(e) => {
                  const cat = categories.find((c) => c.id === e.target.value)
                  setForm({ ...form, categoryId: e.target.value, category: cat?.name || '', specValues: {} })
                }}
                className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
              >
                <option value="">Select category…</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
              {categories.length === 0 && (
                <p className="mt-1.5 text-[11px] text-amber-600">
                  No categories yet.{' '}
                  {onGoToCatalog && <button type="button" onClick={onGoToCatalog} className="underline font-semibold hover:text-amber-700">Go to Catalog to add one →</button>}
                </p>
              )}
            </div>

            {/* Brand from list */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold text-[#213870]">Brand</label>
                {onGoToCatalog && (
                  <button type="button" onClick={onGoToCatalog} className="flex items-center gap-1 text-[10px] font-semibold text-[#10b981] hover:text-[#047857] transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Add Brand
                  </button>
                )}
              </div>
              <select
                value={form.brandId}
                onChange={(e) => {
                  const brand = brands.find((b) => b.id === e.target.value)
                  setForm({ ...form, brandId: e.target.value, brand: brand?.name || '' })
                }}
                className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
              >
                <option value="">Select brand…</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name} {b.verified ? '✓' : ''}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Full price</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="2499" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Original Price (optional, must be &gt; Full price)</label>
              <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="2999 (leave blank if no sale)" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Stock Quantity</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="100" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Badge</label>
              <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all">
                {BADGE_OPTIONS.map((b) => <option key={b} value={b}>{b || 'No badge'}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Product Tag</label>
              <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="e.g. Enterprise Grade, AI-Powered" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Product Rating</label>
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all">
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Product Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Detailed product description…" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all resize-none" />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Product Images (Max 4)</label>
            <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-[#dce5f4] bg-[#f8fafd] hover:border-[#4a65ab] hover:bg-white transition-all">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  if (!files.length) return
                  const allFiles = files.slice(0, 4) // Max 4 files at once
                  
                  // Read files
                  Promise.all(allFiles.map(file => compressImage(file))).then(base64Images => {
                    setForm(prev => {
                      // Combine existing images and new ones, up to 4 total
                      const currentTotal = [prev.img, ...(prev.gallery || [])].filter(Boolean)
                      const combined = [...currentTotal, ...base64Images].slice(0, 4)
                      return {
                        ...prev,
                        img: combined[0] || '',
                        gallery: combined.slice(1)
                      }
                    })
                  })
                }} 
                className="absolute inset-0 cursor-pointer opacity-0 z-10" 
              />
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-[#4a65ab]">
                <svg className="w-8 h-8 opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                <div className="text-center">
                  <p className="text-sm font-semibold">{!form.img ? 'Select main photo' : 'Click to add more photos'}</p>
                  <p className="text-xs text-[#7c96cc] mt-1">Select up to 4 images (optional)</p>
                </div>
              </div>
            </div>

            {/* Previews */}
            {form.img && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7c96cc] mb-2">Selected Images</p>
                <div className="grid grid-cols-4 gap-3">
                  {[form.img, ...(form.gallery || [])].filter(Boolean).map((src, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-xl border border-[#dce5f4] aspect-square bg-[#f0f4fb]">
                      <img src={src} alt="Preview" className="h-full w-full object-cover" />
                      {idx === 0 && (
                        <div className="absolute top-1.5 left-1.5 rounded-md bg-[#10b981] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                          Main Photo
                        </div>
                      )}
                      <button 
                        type="button"
                        onClick={() => {
                          const allImgs = [form.img, ...(form.gallery || [])].filter(Boolean)
                          allImgs.splice(idx, 1)
                          setForm({ ...form, img: allImgs[0] || '', gallery: allImgs.slice(1) })
                        }}
                        className="absolute top-1.5 right-1.5 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Key Features</label>
            <div className="space-y-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#10b981] text-sm">✓</span>
                  <input value={f} onChange={(e) => setFeature(i, e.target.value)} placeholder={`Feature ${i + 1}…`} className="flex-1 rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3 py-2 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Specifications — pick from list */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-[#213870]">Specifications <span className="text-[#7c96cc] font-normal">(select any you need)</span></label>
              {selectedSpecIds.length > 0 && (
                <button type="button" onClick={() => { setSelectedSpecIds([]); setForm((f) => ({ ...f, specValues: {} })) }} className="text-[10px] text-[#7c96cc] hover:text-red-400 transition-colors">Clear all</button>
              )}
            </div>

            {/* Checkbox picker grid */}
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 mb-4 rounded-xl border border-[#f0f4fb] bg-[#f8fafd] p-3">
              {relevantSpecs.map((spec) => {
                const checked = selectedSpecIds.includes(spec.id)
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => {
                      setSelectedSpecIds((prev) =>
                        checked ? prev.filter((id) => id !== spec.id) : [...prev, spec.id]
                      )
                      if (checked) setForm((f) => {
                        const sv = { ...f.specValues }
                        delete sv[spec.name]
                        return { ...f, specValues: sv }
                      })
                    }}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[11px] font-medium transition-all ${checked ? 'border-[#1a2d5a] bg-[#eef2fb] text-[#1a2d5a]' : 'border-[#dce5f4] bg-white text-[#7c96cc] hover:border-[#b3c3e6] hover:text-[#4a65ab]'}`}
                  >
                    <span className={`h-3.5 w-3.5 shrink-0 rounded flex items-center justify-center border transition-all ${checked ? 'border-[#1a2d5a] bg-[#1a2d5a]' : 'border-[#dce5f4] bg-white'}`}>
                      {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                    </span>
                    <span className="truncate">{spec.name}{spec.unit ? ` (${spec.unit})` : ''}</span>
                  </button>
                )
              })}
              {relevantSpecs.length === 0 && (
                <p className="col-span-3 text-[11px] text-[#b3c3e6] py-2">No spec templates yet — add them in Catalog → Specifications.</p>
              )}
            </div>

            {/* Input fields only for selected specs */}
            {selectedSpecIds.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {relevantSpecs.filter((s) => selectedSpecIds.includes(s.id)).map((spec) => (
                  <div key={spec.id}>
                    <label className="mb-1 block text-[11px] font-semibold text-[#7c96cc]">{spec.name}{spec.unit ? ` (${spec.unit})` : ''}</label>
                    <input
                      value={form.specValues[spec.name] || ''}
                      onChange={(e) => setForm({ ...form, specValues: { ...form.specValues, [spec.name]: e.target.value } })}
                      placeholder={`Enter value…`}
                      className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3 py-2 text-xs text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Free Shipping toggle */}
          <div className="flex items-center gap-3 rounded-xl border border-[#dce5f4] bg-[#f8fafd] px-4 py-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, freeShipping: !form.freeShipping })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.freeShipping ? 'bg-[#10b981]' : 'bg-[#dce5f4]'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.freeShipping ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <div>
              <p className="text-xs font-semibold text-[#213870]">🚚 Free Shipping</p>
              <p className="text-[10px] text-[#7c96cc]">{form.freeShipping ? 'Free shipping badge will show on product page' : 'No free shipping badge shown to customers'}</p>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="rounded-lg border border-[#dce5f4] px-5 py-2.5 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Cancel</button>
            <button onClick={handleSave} disabled={!form.name.trim()} className="rounded-lg bg-[#10b981] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#047857] disabled:opacity-40 transition-all">{editing ? 'Update Product' : 'Add Product'}</button>
          </div>
        </div>
      )}

      {/* Search + filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7c96cc]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" /></svg>
          <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search products…" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] pl-9 pr-3 py-2 text-xs text-[#0d1b35] placeholder:text-[#b3c3e6] focus:border-[#4a65ab] focus:outline-none transition-all" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3 py-2 text-xs text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <span className="text-xs text-[#7c96cc]">{allProducts.length} products</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#dce5f4] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f0f4fb] bg-[#f8fafd]">
              {['Product', 'Category / Brand', 'Stock', 'Price', 'Status'].map((col) => (
                <th key={col} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc] whitespace-nowrap">{col}</th>
              ))}
              <th className="sticky right-0 bg-[#f8fafd] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4fb]">
            {allProducts.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-[#b3c3e6]">No products match your search.</td></tr>
            )}
            {allProducts.map((p) => {
              const status = statusOf(p)
              return (
                <tr key={p.id} className="group hover:bg-[#f8fafd] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={p.img} alt={p.name} className="h-10 w-13 rounded-lg object-cover bg-[#f0f4fb] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#0d1b35] line-clamp-1 max-w-[160px]">{p.name}</p>
                        {p.tag && <p className="text-[10px] text-[#7c96cc] mt-0.5">{p.tag}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium text-[#213870]">{p.category}</p>
                    <p className="text-[10px] text-[#7c96cc]">{p.brand}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-12 rounded-full bg-[#f0f4fb] overflow-hidden">
                        <div className={`h-full rounded-full ${p.stock === 0 ? 'bg-red-400' : p.stock < 10 ? 'bg-amber-400' : 'bg-[#10b981]'}`} style={{ width: `${Math.min(100, (p.stock / 150) * 100)}%` }} />
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xs text-[#213870] font-medium">{p.stock}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-xs font-bold text-[#0d1b35]">{formatPrice(p.price.toLocaleString())}</span>
                      {p.originalPrice && <p style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-[10px] text-[#b3c3e6] line-through">{formatPrice(p.originalPrice.toLocaleString())}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusStyle[status]}`}>{status}</span>
                  </td>
                  <td className="sticky right-0 bg-white px-4 py-3 group-hover:bg-[#f8fafd]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { startEdit(p); document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        className="flex items-center gap-1.5 rounded-lg border border-[#dce5f4] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#1a2d5a] hover:bg-[#f0f4fb] hover:border-[#b3c3e6] transition-all"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-red-500 hover:bg-red-50 hover:border-red-300 transition-all"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm !== null && (() => {
        const target = adminProducts.find((p) => p.id === deleteConfirm)
        if (!target) return null
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-[#dce5f4] bg-white p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35] mb-1">Delete Product?</h3>
                  <p className="text-sm text-[#7c96cc] mb-1">This will permanently remove:</p>
                  <div className="flex items-center gap-2 rounded-lg bg-[#f8fafd] border border-[#f0f4fb] p-2 mb-4">
                    <img src={target.img} alt={target.name} className="h-9 w-11 rounded object-cover bg-[#f0f4fb] shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[#0d1b35] line-clamp-1">{target.name}</p>
                      <p className="text-[10px] text-[#7c96cc]">Rs {target.price.toLocaleString()} · {target.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-lg border border-[#dce5f4] py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Cancel</button>
                    <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-all">Yes, Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
