import type { AuthResult, LoginRequest, RegisterRequest } from '../types/auth'
import { postJson } from './apiClient'

const authStorageKey = 'bookrate.auth'

export async function login(request: LoginRequest): Promise<AuthResult> {
  return postJson<AuthResult>('/api/auth/login', request)
}

export async function register(request: RegisterRequest): Promise<AuthResult> {
  return postJson<AuthResult>('/api/auth/register', request)
}

export function saveAuthSession(session: AuthResult): void {
  localStorage.setItem(authStorageKey, JSON.stringify(session))
}

export function getStoredAuthSession(): AuthResult | null {
  const storedValue = localStorage.getItem(authStorageKey)
  if (!storedValue) {
    return null
  }

  try {
    return JSON.parse(storedValue) as AuthResult
  } catch {
    clearStoredAuthSession()
    return null
  }
}

export function clearStoredAuthSession(): void {
  localStorage.removeItem(authStorageKey)
}
