import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
  clearStoredAuthSession,
  getStoredAuthSession,
  login,
  register,
  saveAuthSession,
} from './authService'
import type { AuthResult } from '../types/auth'

const fetchMock = vi.fn()

const authResult: AuthResult = {
  token: 'jwt-token',
  user: {
    id: 'user-1',
    username: 'kitobxon',
    email: 'kitobxon@example.com',
    profilePictureUrl: 'https://example.com/profile.jpg',
    isAdmin: false,
  },
}

function jsonResponse(body: unknown, status = 200): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      status,
    }),
  )
}

describe('authService', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    localStorage.clear()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  test('stores and restores the current auth session', () => {
    saveAuthSession(authResult)

    expect(getStoredAuthSession()).toEqual(authResult)

    clearStoredAuthSession()

    expect(getStoredAuthSession()).toBeNull()
  })

  test('logs in through the backend auth endpoint', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(authResult))

    const result = await login({ username: 'kitobxon', password: 'User123!' })

    expect(result).toEqual(authResult)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'kitobxon',
        password: 'User123!',
      }),
    })
  })

  test('registers a new frontend user through the backend auth endpoint', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(authResult, 201))

    const result = await register({
      username: 'kitobxon',
      email: 'kitobxon@example.com',
      password: 'User123!',
    })

    expect(result).toEqual(authResult)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'kitobxon',
        email: 'kitobxon@example.com',
        password: 'User123!',
      }),
    })
  })
})
