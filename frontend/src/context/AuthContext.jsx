import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true) // true while we check the existing cookie
  const [authError, setAuthError] = useState(null)

  // On first load, ask the backend whether the HTTP-only cookie still
  // represents a valid session. There is no token in localStorage to check —
  // the cookie is invisible to JS by design, so the server is the source of truth.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await authService.getCurrentUser()
        if (!cancelled) setUser(data.user ?? data)
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setInitializing(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setAuthError(null)
    try {
      const data = await authService.login({ email, password })
      setUser(data.user ?? data)
      return { success: true }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, message: err.message }
    }
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    setAuthError(null)
    try {
      const data = await authService.register({ name, email, password })
      setUser(data.user ?? data)
      return { success: true }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, message: err.message }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    initializing,
    authError,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
