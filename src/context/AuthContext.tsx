import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type User = {
  id: string
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (token: string, user: User) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch('http://localhost:3001/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else {
          localStorage.removeItem('token')
        }
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token)
    setUser(user)
  }

  const signOut = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signOut }}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
