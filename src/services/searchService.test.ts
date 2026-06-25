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

  test('loads only the requested backend page when the search query is empty', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      items: apiBooks,
      page: 2,
      pageSize: 9,
      totalCount: 60,
      totalPages: 7,
    }))

    const result = await searchBooks({ query: '', category: 'Dasturlash' }, { page: 2, pageSize: 9 })

    expect(result.items.map((book) => book.id)).toEqual(['book-1', 'book-2'])
    expect(result.totalPages).toBe(7)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5099/api/books?page=2&pageSize=9&category=Dasturlash',
      undefined,
    )
  })

  test('uses backend pagination and category filtering for live search queries', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      items: [apiBooks[1]],
      page: 2,
      pageSize: 9,
      totalCount: 12,
      totalPages: 2,
    }))

    const result = await searchBooks({ query: 'algoritm', category: 'Xavfsizlik' }, { page: 2, pageSize: 9 })

    expect(result.items.map((book) => book.id)).toEqual(['book-2'])
    expect(result.page).toBe(2)
    expect(result.totalCount).toBe(12)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5099/api/books/search?q=algoritm&page=2&pageSize=9&category=Xavfsizlik',
      undefined,
    )
  })
})
