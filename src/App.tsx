import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import PageTransition from './components/PageTransition'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Storefront from './pages/Storefront'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/AdminDashboard'
import UserPanel from './pages/UserPanel'

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-[#f8fafd]">
      <Navbar />
      <PageTransition key={location.pathname}>
        {children}
      </PageTransition>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <CartProvider>
            <Routes>
              {/* Public storefront routes */}
              <Route path="/" element={<StorefrontLayout><Landing /></StorefrontLayout>} />
              <Route path="/products" element={<StorefrontLayout><Storefront /></StorefrontLayout>} />
              <Route path="/products/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
              <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
              <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
              <Route path="/account" element={<StorefrontLayout><UserPanel /></StorefrontLayout>} />

              {/* Auth (no navbar) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Admin panel */}
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </CartProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
