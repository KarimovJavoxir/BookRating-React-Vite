import { createContext } from 'react'
import type { AuthResult, AuthUser } from '../types/auth'

export interface AuthContextValue {
  token: string | null
  user: AuthUser | null
  setSession: (session: AuthResult) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
