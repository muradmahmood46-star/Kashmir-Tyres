import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Product } from '../data/products'
import { useAuth } from './AuthContext'

type CartItem = { product: Product; qty: number }

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product) => Promise<void>
  removeItem: (id: number) => Promise<void>
  updateQty: (id: number, qty: number) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

const API_BASE = `${import.meta.env.PROD ? '' : 'http://localhost:3001'}/api`
const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setItems([])
    }
  }, [user])

  const fetchCart = async () => {
    if (!user) return
    try {
      const res = await fetch(`${API_BASE}/cart_items`, { headers: getHeaders() })
      if (!res.ok) return
      const cartData = await res.json()
      if (!cartData || cartData.length === 0) return

      const prodRes = await fetch(`${API_BASE}/products`, { headers: getHeaders() })
      const productData = await prodRes.json()
      
      const merged = cartData.map((c: any) => {
        const p = productData.find((x: any) => x.id === c.productId)
        if (!p) return null
        return {
          product: {
            ...p,
            categoryId: p.categoryId,
            brandId: p.brandId,
            features: JSON.parse(p.features || '[]'),
            specifications: JSON.parse(p.specifications || '{}'),
          } as unknown as Product,
          qty: c.quantity
        }
      }).filter(Boolean) as CartItem[]
      setItems(merged)
    } catch (e) {
      console.error(e)
    }
  }

  const addItem = async (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1 }]
    })

    if (user) {
      const existing = items.find((i) => i.product.id === product.id)
      const qty = existing ? existing.qty + 1 : 1
      await fetch(`${API_BASE}/cart_items`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId: product.id, quantity: qty })
      })
    }
  }

  const removeItem = async (id: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== id))
    if (user) {
      await fetch(`${API_BASE}/cart_items/${id}`, { method: 'DELETE', headers: getHeaders() })
    }
  }

  const updateQty = async (id: number, qty: number) => {
    if (qty < 1) return removeItem(id)
    setItems((prev) => prev.map((i) => i.product.id === id ? { ...i, qty } : i))
    
    if (user) {
      await fetch(`${API_BASE}/cart_items/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ quantity: qty })
      })
    }
  }

  const clearCart = async () => {
    setItems([])
    if (user) {
      await fetch(`${API_BASE}/cart_items`, { method: 'DELETE', headers: getHeaders() })
    }
  }

  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
