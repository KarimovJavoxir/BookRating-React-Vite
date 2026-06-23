import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import {
  clearStoredAuthSession,
  getStoredAuthSession,
  saveAuthSession,
} from '../services/authService'
import { clearUnauthorizedHandler, setUnauthorizedHandler } from '../services/apiClient'
import type { AuthResult } from '../types/auth'
import { AuthContext, type AuthContextValue } from './authState'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSessionState] = useState<AuthResult | null>(() => getStoredAuthSession())

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearStoredAuthSession()
      setSessionState(null)
    })

    return () => clearUnauthorizedHandler()
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    function setSession(nextSession: AuthResult) {
      saveAuthSession(nextSession)
      setSessionState(nextSession)
    }

    function logout() {
      clearStoredAuthSession()
      setSessionState(null)
    }

    return {
      token: session?.token ?? null,
      user: session?.user ?? null,
      setSession,
      logout,
    }
  }, [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
