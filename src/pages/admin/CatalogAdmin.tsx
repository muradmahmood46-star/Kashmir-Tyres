import { useState } from 'react'
import { useApp, type Category, type Brand, type SpecTemplate } from '../../context/AppContext'

type Tab = 'categories' | 'brands' | 'specifications'

const UNSPLASH_CATEGORY_IMGS = [
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1607000975636-f0a9b0e2f148?w=400&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format',
]

const CATEGORY_ICONS = ['🛡️','📷','🔐','🌐','📊','🔒','⚡','📡','🖥️','🔧','🏢','🚨']
const COUNTRIES = ['USA', 'Germany', 'Israel', 'UK', 'Japan', 'South Korea', 'Canada', 'France', 'Netherlands', 'Singapore']

function emptyCategory(): Omit<Category, 'id'> {
  return { name: '', icon: '🛡️', description: '', image: UNSPLASH_CATEGORY_IMGS[0] }
}
function emptyBrand(): Omit<Brand, 'id'> {
  return { name: '', logo: '', country: 'USA', verified: false }
}
function emptySpec(): Omit<SpecTemplate, 'id'> {
  return { name: '', unit: '', category: '' }
}

export default function CatalogAdmin() {
  const { categories, addCategory, updateCategory, deleteCategory, brands, addBrand, updateBrand, deleteBrand, specTemplates, addSpecTemplate, deleteSpecTemplate, categories: cats } = useApp()
  const [tab, setTab] = useState<Tab>('categories')

  // Category state
  const [catForm, setCatForm] = useState(emptyCategory())
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [showCatForm, setShowCatForm] = useState(false)

  // Brand state
  const [brandForm, setBrandForm] = useState(emptyBrand())
  const [editBrand, setEditBrand] = useState<Brand | null>(null)
  const [showBrandForm, setShowBrandForm] = useState(false)

  // Spec state
  const [specForm, setSpecForm] = useState(emptySpec())
  const [showSpecForm, setShowSpecForm] = useState(false)

  const [saved, setSaved] = useState(false)
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 1500) }

  const handleSaveCategory = () => {
    if (!catForm.name.trim()) return
    if (editCat) {
      updateCategory({ ...editCat, ...catForm })
    } else {
      addCategory({ id: `cat-${Date.now()}`, ...catForm })
    }
    setCatForm(emptyCategory())
    setEditCat(null)
    setShowCatForm(false)
    flash()
  }

  const handleSaveBrand = () => {
    if (!brandForm.name.trim()) return
    if (editBrand) {
      updateBrand({ ...editBrand, ...brandForm })
    } else {
      addBrand({ id: `br-${Date.now()}`, ...brandForm })
    }
    setBrandForm(emptyBrand())
    setEditBrand(null)
    setShowBrandForm(false)
    flash()
  }

  const handleSaveSpec = () => {
    if (!specForm.name.trim()) return
    addSpecTemplate({ id: `sp-${Date.now()}`, ...specForm })
    setSpecForm(emptySpec())
    setShowSpecForm(false)
    flash()
  }

  const startEditCat = (cat: Category) => {
    setEditCat(cat)
    setCatForm({ name: cat.name, icon: cat.icon, description: cat.description, image: cat.image })
    setShowCatForm(true)
  }
  const startEditBrand = (brand: Brand) => {
    setEditBrand(brand)
    setBrandForm({ name: brand.name, logo: brand.logo, country: brand.country, verified: brand.verified })
    setShowBrandForm(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35]">Catalog Management</h2>
          <p className="text-xs text-[#7c96cc] mt-0.5">Manage categories, brands, and specification templates</p>
        </div>
        {saved && <span className="rounded-full bg-[#d1fae5] px-3 py-1 text-xs font-semibold text-[#047857]">✓ Saved successfully</span>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-[#dce5f4] bg-[#f8fafd] p-1 w-fit">
        {([['categories', 'Categories'], ['brands', 'Brands'], ['specifications', 'Specifications']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${tab === id ? 'bg-[#1a2d5a] text-white shadow-sm' : 'text-[#4a65ab] hover:bg-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ─── CATEGORIES ─── */}
      {tab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setShowCatForm(!showCatForm); setEditCat(null); setCatForm(emptyCategory()) }} className="flex items-center gap-1.5 rounded-lg bg-[#1a2d5a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#213870] transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Category
            </button>
          </div>

          {showCatForm && (
            <div className="rounded-xl border border-[#dce5f4] bg-white p-5 space-y-4">
              <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">{editCat ? 'Edit Category' : 'New Category'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Category Name *</label>
                  <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Intrusion Detection" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Icon</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_ICONS.map((icon) => (
                      <button key={icon} type="button" onClick={() => setCatForm({ ...catForm, icon })} className={`h-8 w-8 rounded-lg text-lg transition-all ${catForm.icon === icon ? 'bg-[#1a2d5a] shadow-sm' : 'bg-[#f0f4fb] hover:bg-[#dce5f4]'}`}>{icon}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Description</label>
                <input value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} placeholder="Short description for this category" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button onClick={() => { setShowCatForm(false); setEditCat(null) }} className="rounded-lg border border-[#dce5f4] px-4 py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Cancel</button>
                <button onClick={handleSaveCategory} className="rounded-lg bg-[#10b981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#047857] transition-all">{editCat ? 'Update Category' : 'Save Category'}</button>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-[#dce5f4] bg-white">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafd] border-b border-[#dce5f4]">
                <tr>
                  {['Icon', 'Name', 'Description', 'Actions'].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc]">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4fb]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#f8fafd] transition-colors">
                    <td className="px-4 py-3 text-xl">{cat.icon}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#0d1b35]">{cat.name}</td>
                    <td className="px-4 py-3 text-xs text-[#7c96cc] max-w-[200px] truncate">{cat.description || 'No description'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => startEditCat(cat)} className="rounded-md border border-[#dce5f4] px-2.5 py-1 text-[10px] font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Edit</button>
                        <button onClick={() => deleteCategory(cat.id)} className="rounded-md border border-red-200 px-2.5 py-1 text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-all">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── BRANDS ─── */}
      {tab === 'brands' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setShowBrandForm(!showBrandForm); setEditBrand(null); setBrandForm(emptyBrand()) }} className="flex items-center gap-1.5 rounded-lg bg-[#1a2d5a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#213870] transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Brand
            </button>
          </div>

          {showBrandForm && (
            <div className="rounded-xl border border-[#dce5f4] bg-white p-5 space-y-4">
              <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">{editBrand ? 'Edit Brand' : 'New Brand'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Brand Name *</label>
                  <input value={brandForm.name} onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value, logo: e.target.value.slice(0, 2).toUpperCase() })} placeholder="e.g. FortiNet" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Logo Initials (2 chars)</label>
                  <input value={brandForm.logo} onChange={(e) => setBrandForm({ ...brandForm, logo: e.target.value.slice(0, 2).toUpperCase() })} placeholder="e.g. FN" maxLength={2} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Country of Origin</label>
                  <select value={brandForm.country} onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all">
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={brandForm.verified} onChange={(e) => setBrandForm({ ...brandForm, verified: e.target.checked })} className="sr-only" />
                    <div className={`w-9 h-5 rounded-full transition-colors ${brandForm.verified ? 'bg-[#10b981]' : 'bg-[#dce5f4]'}`}>
                      <div className={`h-3.5 w-3.5 rounded-full bg-white shadow mt-0.5 transition-transform ${brandForm.verified ? 'translate-x-4.5 ml-0' : 'translate-x-0.5'}`} />
                    </div>
                  </label>
                  <span className="text-xs font-semibold text-[#213870]">Verified Brand</span>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setShowBrandForm(false); setEditBrand(null) }} className="rounded-lg border border-[#dce5f4] px-4 py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Cancel</button>
                <button onClick={handleSaveBrand} className="rounded-lg bg-[#10b981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#047857] transition-all">{editBrand ? 'Update Brand' : 'Save Brand'}</button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-[#dce5f4] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0f4fb] bg-[#f8fafd]">
                  {['Logo', 'Brand Name', 'Country', 'Status', 'Actions'].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc]">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4fb]">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-[#f8fafd] transition-colors">
                    <td className="px-4 py-3">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#1a2d5a] to-[#2a4690] flex items-center justify-center text-white text-xs font-bold">{brand.logo || brand.name.slice(0,2).toUpperCase()}</div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#0d1b35]">{brand.name}</td>
                    <td className="px-4 py-3 text-xs text-[#4a65ab]">{brand.country}</td>
                    <td className="px-4 py-3">
                      {brand.verified
                        ? <span className="rounded-full bg-[#d1fae5] px-2.5 py-0.5 text-[10px] font-semibold text-[#047857]">✓ Verified</span>
                        : <span className="rounded-full bg-[#f0f4fb] px-2.5 py-0.5 text-[10px] font-semibold text-[#7c96cc]">Unverified</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => startEditBrand(brand)} className="rounded-md border border-[#dce5f4] px-2.5 py-1 text-[10px] font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Edit</button>
                        <button onClick={() => deleteBrand(brand.id)} className="rounded-md border border-red-200 px-2.5 py-1 text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-all">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── SPECIFICATIONS ─── */}
      {tab === 'specifications' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowSpecForm(!showSpecForm)} className="flex items-center gap-1.5 rounded-lg bg-[#1a2d5a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#213870] transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Specification
            </button>
          </div>

          {showSpecForm && (
            <div className="rounded-xl border border-[#dce5f4] bg-white p-5 space-y-4">
              <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-base font-semibold text-[#0d1b35]">New Specification Template</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Spec Name *</label>
                  <input value={specForm.name} onChange={(e) => setSpecForm({ ...specForm, name: e.target.value })} placeholder="e.g. Rim Diameter" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Unit/Size (Optional)</label>
                  <input value={specForm.unit} onChange={(e) => setSpecForm({ ...specForm, unit: e.target.value })} placeholder="e.g. inches, kg, mm" className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Applies to Category</label>
                  <select value={specForm.category} onChange={(e) => setSpecForm({ ...specForm, category: e.target.value })} className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all">
                    <option value="">All Categories</option>
                    {cats.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowSpecForm(false)} className="rounded-lg border border-[#dce5f4] px-4 py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Cancel</button>
                <button onClick={handleSaveSpec} className="rounded-lg bg-[#10b981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#047857] transition-all">Add Specification</button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-[#dce5f4] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0f4fb] bg-[#f8fafd]">
                  {['Specification Name', 'Unit', 'Category', 'Actions'].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#7c96cc]">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4fb]">
                {specTemplates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-8 h-8 text-[#dce5f4]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <p className="text-xs font-semibold text-[#b3c3e6]">No specifications found</p>
                        <p className="text-[11px] text-[#d1daf0]">Click "Add Specification" above to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : specTemplates.map((spec) => (
                  <tr key={spec.id} className="hover:bg-[#f8fafd] transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold text-[#0d1b35]">{spec.name}</td>
                    <td className="px-4 py-3">
                      {spec.unit ? <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="rounded bg-[#f0f4fb] px-2 py-0.5 text-[11px] text-[#4a65ab]">{spec.unit}</span> : <span className="text-[#b3c3e6] text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {spec.category
                        ? <span className="rounded-full bg-[#dce5f4] px-2.5 py-0.5 text-[10px] font-semibold text-[#1a2d5a]">{spec.category}</span>
                        : <span className="rounded-full bg-[#f0f4fb] px-2.5 py-0.5 text-[10px] text-[#7c96cc]">All</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteSpecTemplate(spec.id)} className="rounded-md border border-red-200 px-2.5 py-1 text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-all">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
