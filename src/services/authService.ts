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
    const session = JSON.parse(storedValue) as unknown
    if (!isAuthResult(session)) {
      clearStoredAuthSession()
      return null
    }

    return session
  } catch {
    clearStoredAuthSession()
    return null
  }
}

export function clearStoredAuthSession(): void {
  localStorage.removeItem(authStorageKey)
}

function isAuthResult(value: unknown): value is AuthResult {
  if (!value || typeof value !== 'object') {
    return false
  }

  const session = value as Partial<AuthResult>
  const user = session.user

  return (
    typeof session.token === 'string' &&
    !!user &&
    typeof user === 'object' &&
    typeof user.id === 'string' &&
    typeof user.username === 'string' &&
    typeof user.email === 'string' &&
    typeof user.isAdmin === 'boolean'
  )
}
