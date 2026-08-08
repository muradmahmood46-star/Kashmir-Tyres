import { formatPrice } from '../../utils/formatPrice'
import { useMemo, useState } from 'react'
import { useApp, type SaleAnnouncement, type AnnouncementApplyType, type Bundle } from '../../context/AppContext'
import { SALE_THEMES } from '../../data/saleThemes'

function emptyAnnouncement(): SaleAnnouncement {
  return {
    id: '',
    name: '',
    occasionTheme: 'general',
    discountPercent: 20,
    appliesTo: { type: 'all', value: '' },
    isActive: false,
  }
}

export default function AnnouncementsAdmin() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, categories, bundles, adminProducts: PRODUCTS } = useApp()
  const [form, setForm] = useState<SaleAnnouncement>(emptyAnnouncement())
  const [editing, setEditing] = useState<SaleAnnouncement | null>(null)
  const [saved, setSaved] = useState(false)

  const activeAnnouncement = useMemo(
    () => announcements.find((announcement) => announcement.isActive),
    [announcements]
  )

  const currentTheme = SALE_THEMES[form.occasionTheme]
  const today = new Date().toISOString().split('T')[0]

  const validAppliesTo = () => {
    const { type, value } = form.appliesTo
    if (type === 'all') return true
    if (type === 'category') return typeof value === 'string' && value.trim().length > 0
    if (type === 'bundle') return typeof value === 'string' && value.trim().length > 0
    if (type === 'products') return Array.isArray(value) && value.length > 0
    return false
  }

  const validForm = form.name.trim().length > 0 && form.discountPercent > 0 && form.discountPercent <= 100 && validAppliesTo()

  const getAppliesLabel = (announcement: SaleAnnouncement) => {
    const { type, value } = announcement.appliesTo
    if (type === 'all') return 'All Products'
    if (type === 'category') return `Category: ${value || 'Any'}`
    if (type === 'bundle') return `Bundle: ${value || 'Selected bundle'}`
    if (type === 'products') return Array.isArray(value) ? `${value.length} products` : 'Selected products'
    return 'All Products'
  }

  const normalizeAnnouncement = (announcement: SaleAnnouncement): SaleAnnouncement => ({
    ...announcement,
    startDate: announcement.startDate ? announcement.startDate : undefined,
    endDate: announcement.endDate ? announcement.endDate : undefined,
  })

  const handleSave = () => {
    if (!validForm) return
    const next = normalizeAnnouncement({ ...form, id: editing?.id ?? `sale-${Date.now()}` })
    if (next.isActive && activeAnnouncement && activeAnnouncement.id !== next.id) {
      const confirmed = window.confirm(`Activating "${next.name}" will deactivate "${activeAnnouncement.name}". Continue?`)
      if (!confirmed) return
    }

    if (editing) updateAnnouncement(next)
    else addAnnouncement(next)

    setForm(emptyAnnouncement())
    setEditing(null)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1500)
  }

  const startEdit = (announcement: SaleAnnouncement) => {
    setEditing(announcement)
    setForm({ ...announcement, startDate: announcement.startDate ?? '', endDate: announcement.endDate ?? '' })
  }

  const toggleAppliesType = (type: AnnouncementApplyType) => {
    setForm((prev) => ({
      ...prev,
      appliesTo: {
        type,
        value: type === 'products' ? [] : type === 'all' ? '' : '',
      },
    }))
  }

  const toggleProductId = (productId: number) => {
    setForm((prev) => {
      const values = Array.isArray(prev.appliesTo.value) ? prev.appliesTo.value : []
      const next = values.includes(String(productId))
        ? values.filter((id) => id !== String(productId))
        : [...values, String(productId)]
      return { ...prev, appliesTo: { ...prev.appliesTo, value: next } }
    })
  }

  const activeDateNote = form.startDate && form.endDate && form.startDate > form.endDate

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-xl font-semibold text-[#0d1b35]">Announcements</h2>
          <p className="text-xs text-[#7c96cc] mt-1">Create promotional announcements and control which one shows on the storefront banner.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="rounded-full bg-[#d1fae5] px-3 py-1 text-xs font-semibold text-[#047857]">✓ Saved</span>}
          <button onClick={() => { setEditing(null); setForm(emptyAnnouncement()) }} className="rounded-lg bg-[#1a2d5a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#213870] transition-all">New Announcement</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-[#dce5f4] bg-white p-6 space-y-5">
          <div>
            <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-lg font-semibold text-[#0d1b35]">{editing ? 'Edit Announcement' : 'Create Announcement'}</h3>
            <p className="text-xs text-[#7c96cc] mt-1">Only one announcement can be active at a time.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Announcement Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. 11.11 Mega Sale"
                className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Discount % *</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Occasion Theme *</label>
              <select
                value={form.occasionTheme}
                onChange={(e) => setForm({ ...form, occasionTheme: e.target.value as SaleAnnouncement['occasionTheme'] })}
                className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
              >
                {Object.entries(SALE_THEMES).map(([key, theme]) => (
                  <option key={key} value={key}>{theme.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Applies To *</label>
              <div className="grid gap-2">
                {(['all', 'category', 'products', 'bundle'] as AnnouncementApplyType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleAppliesType(type)}
                    className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-all ${form.appliesTo.type === type ? 'border-[#1a2d5a] bg-[#f0f4fb] text-[#1a2d5a]' : 'border-[#dce5f4] text-[#4a65ab] hover:border-[#b3c3e6]'}`}
                  >
                    {type === 'all' ? 'All Products' : type === 'category' ? 'Category' : type === 'products' ? 'Specific Products' : 'Bundle'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {form.appliesTo.type === 'category' && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Category</label>
                <select
                  value={typeof form.appliesTo.value === 'string' ? form.appliesTo.value : ''}
                  onChange={(e) => setForm({ ...form, appliesTo: { ...form.appliesTo, value: e.target.value } })}
                  className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
            )}

            {form.appliesTo.type === 'bundle' && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Bundle</label>
                <select
                  value={typeof form.appliesTo.value === 'string' ? form.appliesTo.value : ''}
                  onChange={(e) => setForm({ ...form, appliesTo: { ...form.appliesTo, value: e.target.value } })}
                  className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
                >
                  <option value="">Select bundle</option>
                  {bundles.map((bundle) => (
                    <option key={bundle.id} value={bundle.id}>{bundle.name}</option>
                  ))}
                </select>
              </div>
            )}

            {form.appliesTo.type === 'products' && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Select Products</label>
                <div className="grid max-h-60 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {PRODUCTS.map((product) => {
                    const selected = Array.isArray(form.appliesTo.value) && form.appliesTo.value.includes(String(product.id))
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => toggleProductId(product.id)}
                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-left transition-all ${selected ? 'border-[#1a2d5a] bg-[#f0f4fb]' : 'border-[#dce5f4] hover:border-[#b3c3e6]'}`}
                      >
                        <img src={product.img} alt={product.name} className="h-10 w-12 rounded object-cover bg-[#f0f4fb] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-[#0d1b35] line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-[#7c96cc]">{formatPrice(product.price.toLocaleString())}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">Start Date</label>
              <input
                type="date"
                value={form.startDate ?? ''}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#213870]">End Date</label>
              <input
                type="date"
                value={form.endDate ?? ''}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-lg border border-[#dce5f4] bg-[#f8fafd] px-3.5 py-2.5 text-sm text-[#0d1b35] focus:border-[#4a65ab] focus:outline-none transition-all"
              />
            </div>
          </div>

          {activeDateNote && <p className="text-sm text-red-600">Start date must be before end date.</p>}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${form.isActive ? 'bg-[#10b981]' : 'bg-[#dce5f4]'}`}
            >
              <span className={`inline-block h-7 w-7 transform rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <div>
              <p className="text-sm font-semibold text-[#0d1b35]">{form.isActive ? 'Active now' : 'Inactive'}</p>
              <p className="text-xs text-[#7c96cc]">Only one announcement can be active at a time.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-end pt-1">
            <button onClick={() => { setEditing(null); setForm(emptyAnnouncement()) }} className="rounded-lg border border-[#dce5f4] px-5 py-2 text-xs font-semibold text-[#4a65ab] hover:bg-[#f0f4fb] transition-all">Cancel</button>
            <button onClick={handleSave} disabled={!validForm || activeDateNote} className="rounded-lg bg-[#10b981] px-5 py-2 text-xs font-semibold text-white hover:bg-[#047857] disabled:opacity-40 transition-all">{editing ? 'Update Announcement' : 'Create Announcement'}</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#dce5f4] bg-white p-5" style={{ backgroundImage: currentTheme.gradient }}>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-white shadow-lg shadow-[#00000017]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">{currentTheme.icon}</div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">Live preview</p>
                  <p className="text-xl font-semibold">{form.discountPercent}% OFF</p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl bg-white/10 p-4">
                <p className="text-sm font-semibold text-white">{form.name || 'Sale name'}</p>
                <p className="mt-2 text-[13px] text-white/80">{getAppliesLabel(form)}</p>
                {form.startDate && form.endDate && (
                  <p className="mt-2 text-[11px] text-white/70">{form.startDate} → {form.endDate}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#dce5f4] bg-white p-5">
            <h3 style={{ fontFamily: 'Fraunces, serif' }} className="text-sm font-semibold text-[#0d1b35]">Current Announcements</h3>
            <div className="mt-4 space-y-3">
              {announcements.length === 0 && <p className="text-sm text-[#7c96cc]">No announcements yet. Create one to show on the storefront banner.</p>}
              {announcements.map((announcement) => {
                const isActive = announcement.isActive && !(announcement.startDate && announcement.endDate && (today < announcement.startDate || today > announcement.endDate))
                return (
                  <div key={announcement.id} className="rounded-2xl border border-[#dce5f4] bg-[#f8fafd] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#0d1b35]">
                          <span>{SALE_THEMES[announcement.occasionTheme].icon}</span>
                          <span className="truncate">{announcement.name}</span>
                        </div>
                        <p className="text-[11px] text-[#7c96cc] mt-1">{announcement.discountPercent}% off · {getAppliesLabel(announcement)}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${isActive ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#e5e7eb] text-[#64748b]'}`}>
                        {isActive ? 'Active' : announcement.isActive ? 'Scheduled' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {announcement.startDate && announcement.endDate && <span className="rounded-full bg-white px-2.5 py-1 text-[10px] text-[#4a5c7a]">{announcement.startDate} → {announcement.endDate}</span>}
                      <button onClick={() => startEdit(announcement)} className="rounded-full border border-[#dce5f4] px-3 py-1.5 text-[10px] font-semibold text-[#4a65ab] hover:bg-white transition-all">Edit</button>
                      <button
                        onClick={() => {
                          if (!announcement.isActive && activeAnnouncement && activeAnnouncement.id !== announcement.id) {
                            const confirmed = window.confirm(`Activating "${announcement.name}" will deactivate "${activeAnnouncement.name}". Continue?`)
                            if (!confirmed) return
                          }
                          updateAnnouncement({ ...announcement, isActive: !announcement.isActive })
                        }}
                        className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold transition-all ${announcement.isActive ? 'border-amber-300 text-amber-600 hover:bg-amber-50' : 'border-[#d1fae5] text-[#047857] hover:bg-[#ecfdf5]'}`}
                      >
                        {announcement.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => deleteAnnouncement(announcement.id)} className="rounded-full border border-red-200 px-3 py-1.5 text-[10px] font-semibold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
