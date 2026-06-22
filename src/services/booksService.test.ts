import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getBookById, getBooks, getBookCategories, getTopRatedBooks } from './booksService'

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

describe('booksService', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  test('loads books from the backend list endpoint', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(apiBooks))

    const books = await getBooks()

    expect(books).toEqual(apiBooks)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/books', undefined)
  })

  test('loads book details from the backend details endpoint', async () => {
    const details = {
      ...apiBooks[0],
      description: 'Kitob tavsifi',
      publishedYear: 2024,
      recentRatings: [],
    }
    fetchMock.mockResolvedValueOnce(jsonResponse(details))

    const book = await getBookById('book-1')

    expect(book).toEqual(details)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/books/book-1', undefined)
  })

  test('derives categories from backend books', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(apiBooks))

    await expect(getBookCategories()).resolves.toEqual(['Dasturlash', 'Xavfsizlik'])
  })

  test('uses backend books for the top-rated list', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(apiBooks))

    const books = await getTopRatedBooks(1)

    expect(books.map((book) => book.id)).toEqual(['book-2'])
  })
})
