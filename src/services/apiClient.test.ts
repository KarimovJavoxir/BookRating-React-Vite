import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
  clearUnauthorizedHandler,
  getJson,
  postJson,
  resolveApiBaseUrl,
  setUnauthorizedHandler,
} from './apiClient'

const fetchMock = vi.fn()

function jsonResponse(body: unknown, init?: ResponseInit): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
      ...init,
    }),
  )
}

describe('apiClient', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    clearUnauthorizedHandler()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  test('uses the backend API base URL when reading JSON', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([{ id: 'book-1' }]))

    const books = await getJson<Array<{ id: string }>>('/api/books')

    expect(books).toEqual([{ id: 'book-1' }])
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/books', undefined)
  })

  test('sends JSON request bodies through the API client', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'book-1', averageRating: 5 }))

    const book = await postJson<{ id: string; averageRating: number }>('/api/books/book-1/ratings', {
      value: 5,
      comment: 'Foydali kitob',
    })

    expect(book).toEqual({ id: 'book-1', averageRating: 5 })
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/books/book-1/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: 5,
        comment: 'Foydali kitob',
      }),
    })
  })

  test('adds bearer token when an authenticated request is sent', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'book-1' }))

    await postJson('/api/books', { title: 'Yangi kitob' }, { authToken: 'jwt-token' })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/books', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer jwt-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Yangi kitob',
      }),
    })
  })

  test('uses API problem details in error messages', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          title: 'Reyting qiymati notoʻgʻri.',
          detail: 'Rating value must be between 1 and 5.',
        },
        { status: 400 },
      ),
    )

    await expect(getJson('/api/books/missing')).rejects.toThrow(
      'Reyting qiymati notoʻgʻri. Rating value must be between 1 and 5.',
    )
  })

  test('rejects missing production API base URL instead of falling back to localhost', () => {
    expect(() => resolveApiBaseUrl({ VITE_API_BASE_URL: '', PROD: true })).toThrow(
      'VITE_API_BASE_URL production uchun majburiy.',
    )
  })

  test('runs the unauthorized handler when the backend rejects an authenticated request', async () => {
    const unauthorizedHandler = vi.fn()
    setUnauthorizedHandler(unauthorizedHandler)
    fetchMock.mockResolvedValueOnce(jsonResponse({ title: 'Unauthorized' }, { status: 401 }))

    await expect(getJson('/api/admin/books', { authToken: 'expired-token' })).rejects.toThrow()

    expect(unauthorizedHandler).toHaveBeenCalledTimes(1)
  })
})
