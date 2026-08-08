import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { type OccasionTheme } from '../data/saleThemes'
import { Product } from '../data/products'

export type Role = 'admin' | 'super_admin' | 'manager' | 'viewer' | 'customer'

export type Bundle = {
  id: string
  name: string
  description: string
  productIds: number[]
  originalTotal: number
  bundlePrice: number
  discountType: 'flat' | 'percent' | 'upto'
  discountValue: number
  badge: string
  heroImage: string
  active: boolean
  isPopular: boolean
  freeShipping: boolean
  createdAt: string
}

export type Category = {
  id: string
  name: string
  icon: string
  description: string
  image: string
}

export type Brand = {
  id: string
  name: string
  logo: string
  country: string
  verified: boolean
}

export type AnnouncementApplyType = 'all' | 'category' | 'products' | 'bundle'

export type SaleAnnouncement = {
  id: string
  name: string
  occasionTheme: OccasionTheme
  discountPercent: number
  appliesTo: {
    type: AnnouncementApplyType
    value: string | string[]
  }
  isActive: boolean
  startDate?: string
  endDate?: string
}

export type SpecTemplate = {
  id: string
  name: string
  unit: string
  category: string
}

export type Address = {
  id: string
  label: string
  locationType: string
  firstName: string
  lastName: string
  company: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  fullAddress: string
  isDefault: boolean
}

export type WishlistItem = { productId: number; addedAt: string }

export type AdminProduct = Product & {
  categoryId: string
  brandId: string
  specifications: Record<string, string>
  gallery?: string[]
}

export type TrustedOrg = {
  id: string
  name: string
  industry: string
}

export type HeroStat = {
  id: string
  value: string
  label: string
}

export type GlobalSettings = {
  orgName: string
  timezone: string
  language: string
  currency: string
  bannerImage: string
  bannerLabel: string
  bannerTitle: string
  bannerSubtext: string
  sliderImages?: string[]
}

type AppContextType = {
  currentRole: Role
  setCurrentRole: (r: Role) => void
  bundles: Bundle[]
  setBundles: (b: Bundle[]) => void
  addBundle: (b: Bundle) => void
  updateBundle: (b: Bundle) => void
  deleteBundle: (id: string) => void
  categories: Category[]
  setCategories: (c: Category[]) => void
  addCategory: (c: Category) => void
  updateCategory: (c: Category) => void
  deleteCategory: (id: string) => void
  brands: Brand[]
  setBrands: (b: Brand[]) => void
  addBrand: (b: Brand) => void
  updateBrand: (b: Brand) => void
  deleteBrand: (id: string) => void
  specTemplates: SpecTemplate[]
  setSpecTemplates: (s: SpecTemplate[]) => void
  addSpecTemplate: (s: SpecTemplate) => void
  deleteSpecTemplate: (id: string) => void
  wishlist: WishlistItem[]
  toggleWishlist: (productId: number) => void
  isWishlisted: (productId: number) => boolean
  addresses: Address[]
  addAddress: (a: Address) => void
  updateAddress: (a: Address) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  adminProducts: AdminProduct[]
  addAdminProduct: (p: AdminProduct) => void
  updateAdminProduct: (p: AdminProduct) => void
  deleteAdminProduct: (id: number) => void
  getProductsInBundle: (bundle: Bundle) => Product[]
  announcements: SaleAnnouncement[]
  addAnnouncement: (a: SaleAnnouncement) => void
  updateAnnouncement: (a: SaleAnnouncement) => void
  deleteAnnouncement: (id: string) => void
  activeSaleBanner: SaleAnnouncement | Bundle | null
  trustedOrgs: TrustedOrg[]
  addTrustedOrg: (o: TrustedOrg) => void
  updateTrustedOrg: (id: string, org: Partial<TrustedOrg>) => void
  deleteTrustedOrg: (id: string) => void
  reorderTrustedOrgs: (orgs: TrustedOrg[]) => void
  heroStats: HeroStat[]
  updateHeroStat: (s: HeroStat) => void
  settings: GlobalSettings
  updateSettings: (s: Partial<GlobalSettings>) => void
}

const AppContext = createContext<AppContextType | null>(null)

const API_BASE = (import.meta.env.PROD ? '' : 'http://localhost:3001') + '/api'
const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  
  const [currentRole, setCurrentRole] = useState<Role>('customer')
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [specTemplates, setSpecTemplates] = useState<SpecTemplate[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([])
  const [heroStats, setHeroStats] = useState<HeroStat[]>([])
  const [trustedOrgs, setTrustedOrgs] = useState<TrustedOrg[]>([])
  const [announcements, setAnnouncements] = useState<SaleAnnouncement[]>([])
  const [settings, setSettings] = useState<GlobalSettings>({
    orgName: 'Star Sports',
    timezone: 'America/New_York',
    language: 'English (US)',
    dateFormat: 'MM/DD/YYYY',
    currency: 'Rs',
    bannerImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1440&h=500&fit=crop&auto=format',
    bannerLabel: '24/7 Security Operations',
    bannerTitle: 'Your Threats Never Sleep.\nNeither Do We.',
    bannerSubtext: 'Round-the-clock monitoring by certified security analysts backed by AI-powered automation.'
  })

  useEffect(() => {
    ;(window as any).appSettings = settings
  }, [settings])

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (user) {
      setCurrentRole(user.role as Role)
      fetchUserData()
    } else {
      setWishlist([])
      setAddresses([])
      setCurrentRole('customer')
    }
  }, [user])

  const fetchInitialData = async () => {
    try {
      const [catsRes, brsRes, prodsRes, bunsRes, orgsRes, statsRes, settingsRes, specsRes] = await Promise.all([
        fetch(`${API_BASE}/categories`).then(r => r.json()),
        fetch(`${API_BASE}/brands`).then(r => r.json()),
        fetch(`${API_BASE}/products`).then(r => r.json()),
        fetch(`${API_BASE}/bundles`).then(r => r.json()),
        fetch(`${API_BASE}/trusted_orgs`).then(r => r.json()),
        fetch(`${API_BASE}/hero_stats`).then(r => r.json()),
        fetch(`${API_BASE}/admin/settings`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/spec_templates`).then(r => r.json()).catch(() => [])
      ])

      setCategories(catsRes || [])
      setBrands(brsRes || [])
      setSpecTemplates(specsRes || [])
      setAdminProducts((prodsRes || []).map((p: any) => {
        const cat = (catsRes || []).find((c: any) => c.id === p.categoryId)
        const brand = (brsRes || []).find((b: any) => b.id === p.brandId)
        const specs = JSON.parse(p.specifications || '{}')
        return {
          ...p,
          categoryId: p.categoryId,
          brandId: p.brandId,
          category: cat ? cat.name : '',
          brand: brand ? brand.name : '',
          features: JSON.parse(p.features || '[]'),
          specifications: specs,
          specs: specs,
          gallery: JSON.parse(p.gallery || '[]')
        }
      }))
      setBundles((bunsRes || []).map((b: any) => ({
        ...b,
        productIds: JSON.parse(b.productIds || '[]')
      })))
      setTrustedOrgs(orgsRes || [])
      setHeroStats(statsRes || [])
      if (settingsRes && settingsRes.orgName) {
        settingsRes.sliderImages = typeof settingsRes.sliderImages === 'string' ? JSON.parse(settingsRes.sliderImages || '[]') : (settingsRes.sliderImages || [])
        setSettings(settingsRes)
      }
    } catch (error) {
      console.error('Error fetching initial data', error)
    }
  }

  const fetchUserData = async () => {
    try {
      const [wlistRes, addrsRes] = await Promise.all([
        fetch(`${API_BASE}/wishlists`, { headers: getHeaders() }).then(r => r.json()),
        fetch(`${API_BASE}/addresses`, { headers: getHeaders() }).then(r => r.json())
      ])
      setWishlist(wlistRes || [])
      setAddresses(addrsRes || [])
    } catch (e) {
      console.error(e)
    }
  }

  const updateSettings = async (updates: Partial<GlobalSettings>) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    try {
      const dbData = { ...newSettings, sliderImages: JSON.stringify(newSettings.sliderImages || []) }
      await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dbData)
      })
    } catch (e) {
      console.error('Failed to update settings', e)
    }
  }

  const addBundle = async (b: Bundle) => {
    const dbData: any = { ...b, productIds: JSON.stringify(b.productIds) }
    delete dbData.id
    delete dbData.createdAt
    const res = await fetch(`${API_BASE}/bundles`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(dbData)
    })
    const data = await res.json()
    if (data.id) {
      setBundles(prev => [...prev, { ...data, productIds: JSON.parse(data.productIds || '[]') }])
    }
  }
  const updateBundle = async (b: Bundle) => {
    const res = await fetch(`${API_BASE}/bundles/${b.id}`, {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify({ ...b, productIds: JSON.stringify(b.productIds) })
    })
    const data = await res.json()
    setBundles(prev => prev.map(x => x.id === b.id ? { ...data, productIds: JSON.parse(data.productIds || '[]') } : x))
  }
  const deleteBundle = async (id: string) => {
    await fetch(`${API_BASE}/bundles/${id}`, { method: 'DELETE', headers: getHeaders() })
    setBundles(prev => prev.filter(x => x.id !== id))
  }

  const addCategory = async (c: Category) => {
    const res = await fetch(`${API_BASE}/categories`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(c) })
    const data = await res.json()
    setCategories(prev => [...prev, data])
  }
  const updateCategory = async (c: Category) => {
    const res = await fetch(`${API_BASE}/categories/${c.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(c) })
    const data = await res.json()
    setCategories(prev => prev.map(x => x.id === c.id ? data : x))
  }
  const deleteCategory = async (id: string) => {
    await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE', headers: getHeaders() })
    setCategories(prev => prev.filter(x => x.id !== id))
  }

  const addBrand = async (b: Brand) => {
    const res = await fetch(`${API_BASE}/brands`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(b) })
    const data = await res.json()
    setBrands(prev => [...prev, data])
  }
  const updateBrand = async (b: Brand) => {
    const res = await fetch(`${API_BASE}/brands/${b.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(b) })
    const data = await res.json()
    setBrands(prev => prev.map(x => x.id === b.id ? data : x))
  }
  const deleteBrand = async (id: string) => {
    await fetch(`${API_BASE}/brands/${id}`, { method: 'DELETE', headers: getHeaders() })
    setBrands(prev => prev.filter(x => x.id !== id))
  }

  const addSpecTemplate = async (s: SpecTemplate) => {
    const res = await fetch(`${API_BASE}/spec_templates`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(s) })
    const data = await res.json()
    setSpecTemplates(prev => [...prev, data])
  }
  const deleteSpecTemplate = async (id: string) => {
    await fetch(`${API_BASE}/spec_templates/${id}`, { method: 'DELETE', headers: getHeaders() })
    setSpecTemplates(prev => prev.filter(x => x.id !== id))
  }

  const toggleWishlist = async (productId: number) => {
    if (!user) return
    const exists = wishlist.some(w => w.productId === productId)
    if (exists) {
      await fetch(`${API_BASE}/wishlists/${productId}`, { method: 'DELETE', headers: getHeaders() })
      setWishlist(prev => prev.filter(w => w.productId !== productId))
    } else {
      const res = await fetch(`${API_BASE}/wishlists`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ productId }) })
      const data = await res.json()
      setWishlist(prev => [...prev, data])
    }
  }
  const isWishlisted = (productId: number) => wishlist.some(w => w.productId === productId)

  const addAddress = async (a: Address) => {
    if (!user) return
    const res = await fetch(`${API_BASE}/addresses`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(a) })
    const data = await res.json()
    setAddresses(prev => [...prev, data])
  }
  const updateAddress = async (a: Address) => {
    if (!user) return
    const res = await fetch(`${API_BASE}/addresses/${a.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(a) })
    const data = await res.json()
    setAddresses(prev => prev.map(x => x.id === a.id ? data : x))
  }
  const deleteAddress = async (id: string) => {
    await fetch(`${API_BASE}/addresses/${id}`, { method: 'DELETE', headers: getHeaders() })
    setAddresses(prev => prev.filter(x => x.id !== id))
  }
  const setDefaultAddress = async (id: string) => {
    if (!user) return
    // Since this requires two updates, keeping it simple for the client side simulation
    setAddresses(prev => prev.map(x => ({ ...x, isDefault: x.id === id })))
  }

  const addAdminProduct = async (p: AdminProduct) => {
    const dbData: any = { ...p, features: JSON.stringify(p.features), specifications: JSON.stringify(p.specifications), gallery: JSON.stringify(p.gallery || []) }
    delete dbData.id
    delete dbData.category
    delete dbData.brand
    delete dbData.specs
    const res = await fetch(`${API_BASE}/products`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(dbData) })
    const data = await res.json()
    if (data.id) {
      setAdminProducts(prev => [...prev, { ...data, category: p.category, brand: p.brand, specs: JSON.parse(data.specifications || '{}'), features: JSON.parse(data.features || '[]'), specifications: JSON.parse(data.specifications || '{}'), gallery: JSON.parse(data.gallery || '[]') }])
    }
  }
  const updateAdminProduct = async (p: AdminProduct) => {
    const dbData: any = { ...p, features: JSON.stringify(p.features), specifications: JSON.stringify(p.specifications), gallery: JSON.stringify(p.gallery || []) }
    delete dbData.category
    delete dbData.brand
    delete dbData.specs
    const res = await fetch(`${API_BASE}/products/${p.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(dbData) })
    const data = await res.json()
    if (data.id) {
      setAdminProducts(prev => prev.map(x => x.id === p.id ? { ...data, category: p.category, brand: p.brand, specs: JSON.parse(data.specifications || '{}'), features: JSON.parse(data.features || '[]'), specifications: JSON.parse(data.specifications || '{}'), gallery: JSON.parse(data.gallery || '[]') } : x))
    }
  }
  const deleteAdminProduct = async (id: number) => {
    await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: getHeaders() })
    setAdminProducts(prev => prev.filter(x => x.id !== id))
  }

  const updateHeroStat = async (s: HeroStat) => {
    const res = await fetch(`${API_BASE}/hero_stats/${s.id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(s) })
    const data = await res.json()
    setHeroStats(prev => prev.map(x => x.id === s.id ? data : x))
  }
  
  const addTrustedOrg = async (o: TrustedOrg) => {
    const res = await fetch(`${API_BASE}/trusted_orgs`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(o) })
    const data = await res.json()
    setTrustedOrgs(prev => [...prev, data])
  }
  const updateTrustedOrg = async (id: string, o: Partial<TrustedOrg>) => {
    const res = await fetch(`${API_BASE}/trusted_orgs/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(o) })
    const data = await res.json()
    setTrustedOrgs(prev => prev.map(x => x.id === id ? data : x))
  }
  const deleteTrustedOrg = async (id: string) => {
    await fetch(`${API_BASE}/trusted_orgs/${id}`, { method: 'DELETE', headers: getHeaders() })
    setTrustedOrgs(prev => prev.filter(x => x.id !== id))
  }
  const reorderTrustedOrgs = (orgs: TrustedOrg[]) => setTrustedOrgs(orgs)

  const addAnnouncement = (a: SaleAnnouncement) =>
    setAnnouncements((prev) => prev.map((x) => ({ ...x, isActive: a.isActive ? false : x.isActive })).concat(a))
  const updateAnnouncement = (a: SaleAnnouncement) =>
    setAnnouncements((prev) => prev.map((x) => x.id === a.id ? a : (a.isActive ? { ...x, isActive: false } : x)))
  const deleteAnnouncement = (id: string) => setAnnouncements((prev) => prev.filter((x) => x.id !== id))

  const getProductsInBundle = (bundle: Bundle) =>
    adminProducts.filter((p) => bundle.productIds.includes(p.id))

  const today = new Date().toISOString().split('T')[0]
  const announcementBanner = announcements.find((a) => {
    if (!a.isActive) return false
    if (a.startDate && a.endDate) return a.startDate <= today && today <= a.endDate
    return true
  }) ?? null
  const bundleBanner = bundles.find((b) => b.active) ?? null
  const activeSaleBanner = announcementBanner ?? bundleBanner

  return (
    <AppContext.Provider value={{
      currentRole, setCurrentRole,
      bundles, setBundles, addBundle, updateBundle, deleteBundle,
      categories, setCategories, addCategory, updateCategory, deleteCategory,
      brands, setBrands, addBrand, updateBrand, deleteBrand,
      specTemplates, setSpecTemplates, addSpecTemplate, deleteSpecTemplate,
      wishlist, toggleWishlist, isWishlisted,
      addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress,
      adminProducts, addAdminProduct, updateAdminProduct, deleteAdminProduct,
      getProductsInBundle,
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
      activeSaleBanner,
      trustedOrgs, addTrustedOrg, updateTrustedOrg, deleteTrustedOrg, reorderTrustedOrgs,
      heroStats, updateHeroStat,
      settings, updateSettings,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}

export const ROLE_PERMISSIONS: Record<Role, Record<string, boolean>> = {
  admin: { manageUsers: true, manageProducts: true, manageBundles: true, manageOrders: true, manageSettings: true, manageCatalog: true, viewReports: true },
  super_admin: { manageUsers: true, manageProducts: true, manageBundles: true, manageOrders: true, manageSettings: true, manageCatalog: true, viewReports: true },
  manager: { manageUsers: false, manageProducts: true, manageBundles: true, manageOrders: true, manageSettings: false, manageCatalog: true, viewReports: true },
  viewer: { manageUsers: false, manageProducts: false, manageBundles: false, manageOrders: false, manageSettings: false, manageCatalog: false, viewReports: true },
  customer: { manageUsers: false, manageProducts: false, manageBundles: false, manageOrders: false, manageSettings: false, manageCatalog: false, viewReports: false },
}
