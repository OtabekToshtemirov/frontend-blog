"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, getMe } from "@/lib/api/auth"
import type { User } from "@/lib/types"
import { getStoredToken } from "@/lib/utils"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()

    // Setup interval to check token expiration
    const intervalId = setInterval(checkAuth, 5 * 60 * 1000) // Check every 5 minutes
    
    return () => clearInterval(intervalId)
  }, [])

  const checkAuth = async () => {
    const token = getStoredToken() // This will check expiration and remove if expired
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const userData = await getMe()
      setUser(userData)
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("tokenExpiration")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const { token, ...userData } = await apiLogin(email, password)
    const expirationTime = new Date().getTime() + 60 * 24 * 60 * 60 * 1000 // 60 days
    localStorage.setItem("token", token)
    localStorage.setItem("tokenExpiration", expirationTime.toString())
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiration")
    setUser(null)
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

