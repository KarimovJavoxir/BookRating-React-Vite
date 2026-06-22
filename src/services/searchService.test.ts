import { beforeEach, describe, expect, test, vi } from 'vitest'
import { searchBooks } from './searchService'

const fetchMock = vi.fn()

const apiBooks = [
  {
    id: 'book-1',
    title: 'Algoritmlar',
    author: 'Namuna muallif',
    category: 'Dasturlash',
    coverImageUrl: null,
    averageRating: 4.2,
    ratingsCount: 8,
  },
  {
    id: 'book-2',
    title: 'Axborot xavfsizligi',
    author: 'Namuna muallif',
    category: 'Xavfsizlik',
    coverImageUrl: null,
    averageRating: 4.8,
    ratingsCount: 12,
  },
]

function jsonResponse(body: unknown): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }),
  )
}

describe('searchService', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  test('loads the full backend list when the search query is empty', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(apiBooks))

    const books = await searchBooks({ query: '' })

    expect(books.map((book) => book.id)).toEqual(['book-2', 'book-1'])
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/books', undefined)
  })

  test('uses the backend search endpoint for live search queries', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([apiBooks[0]]))

    const books = await searchBooks({ query: 'algoritm' })

    expect(books.map((book) => book.id)).toEqual(['book-1'])
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5099/api/books/search?q=algoritm',
      undefined,
    )
  })

  test('keeps category filtering client-side after backend search', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(apiBooks))

    const books = await searchBooks({ query: 'a', category: 'Xavfsizlik' })

    expect(books.map((book) => book.id)).toEqual(['book-2'])
  })
})
