import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
  createBook,
  deleteBook,
  getAdminBooks,
  getBookById,
  getBooks,
  getBooksPage,
  getBookCategories,
  getTopRatedBooks,
  updateBook,
} from './booksService'

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
    status: 'Verified',
  },
  {
    id: 'book-2',
    title: 'Axborot xavfsizligi',
    author: 'Namuna muallif',
    category: 'Xavfsizlik',
    coverImageUrl: null,
    averageRating: 4.8,
    ratingsCount: 12,
    status: 'Verified',
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
    const page = {
      items: apiBooks,
      page: 2,
      pageSize: 6,
      totalCount: 14,
      totalPages: 3,
    }
    fetchMock.mockResolvedValueOnce(jsonResponse(page))

    const books = await getBooksPage({ page: 2, pageSize: 6 })

    expect(books).toEqual(page)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5099/api/books?page=2&pageSize=6',
      undefined,
    )
  })

  test('loads every public book page when a full list is needed', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({
        items: [apiBooks[0]],
        page: 1,
        pageSize: 100,
        totalCount: 2,
        totalPages: 2,
      }))
      .mockResolvedValueOnce(jsonResponse({
        items: [apiBooks[1]],
        page: 2,
        pageSize: 100,
        totalCount: 2,
        totalPages: 2,
      }))

    const books = await getBooks()

    expect(books).toEqual(apiBooks)
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:5099/api/books?page=1&pageSize=100',
      undefined,
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:5099/api/books?page=2&pageSize=100',
      undefined,
    )
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
    fetchMock.mockResolvedValueOnce(jsonResponse({
      items: apiBooks,
      page: 1,
      pageSize: 100,
      totalCount: 2,
      totalPages: 1,
    }))

    await expect(getBookCategories()).resolves.toEqual(['Dasturlash', 'Xavfsizlik'])
  })

  test('uses backend books for the top-rated list', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      items: apiBooks,
      page: 1,
      pageSize: 100,
      totalCount: 2,
      totalPages: 1,
    }))

    const books = await getTopRatedBooks(1)

    expect(books.map((book) => book.id)).toEqual(['book-2'])
  })

  test('creates a book through the admin backend endpoint', async () => {
    const createdBook = {
      ...apiBooks[0],
      description: 'Yangi tavsif',
      publishedYear: 2026,
      recentRatings: [],
    }
    fetchMock.mockResolvedValueOnce(jsonResponse(createdBook))

    const result = await createBook(
      {
        title: 'Yangi kitob',
        author: 'Yangi muallif',
        category: 'Dasturlash',
        description: 'Yangi tavsif',
        publishedYear: 2026,
        coverImageUrl: '',
        status: 'New',
      },
      'admin-token',
    )

    expect(result).toEqual(createdBook)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/books', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Yangi kitob',
        author: 'Yangi muallif',
        category: 'Dasturlash',
        description: 'Yangi tavsif',
        publishedYear: 2026,
        coverImageUrl: undefined,
        status: 'New',
      }),
    })
  })

  test('loads all admin books with admin token', async () => {
    const adminBooks = [
      ...apiBooks,
      {
        id: 'book-3',
        title: 'Tasdiqlanmagan kitob',
        author: 'Admin',
        category: 'Test',
        description: null,
        publishedYear: 2026,
        coverImageUrl: null,
        averageRating: 0,
        ratingsCount: 0,
        status: 'New',
      },
    ]
    const page = {
      items: adminBooks,
      page: 3,
      pageSize: 5,
      totalCount: 13,
      totalPages: 3,
    }
    fetchMock.mockResolvedValueOnce(jsonResponse(page))

    await expect(getAdminBooks('admin-token', { page: 3, pageSize: 5 })).resolves.toEqual(page)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/admin/books?page=3&pageSize=5', {
      headers: {
        Authorization: 'Bearer admin-token',
      },
    })
  })

  test('updates a book through the admin backend endpoint', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(apiBooks[0]))

    await updateBook(
      'book-1',
      {
        title: 'Yangilangan kitob',
        author: 'Muallif',
        category: '',
        description: '',
        publishedYear: null,
        coverImageUrl: '',
        status: 'Verified',
      },
      'admin-token',
    )

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/books/book-1', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Yangilangan kitob',
        author: 'Muallif',
        category: undefined,
        description: undefined,
        publishedYear: undefined,
        coverImageUrl: undefined,
        status: 'Verified',
      }),
    })
  })

  test('deletes a book through the admin backend endpoint', async () => {
    fetchMock.mockResolvedValueOnce(Promise.resolve(new Response(null, { status: 204 })))

    await deleteBook('book-1', 'admin-token')

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/books/book-1', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer admin-token',
      },
    })
  })
})
