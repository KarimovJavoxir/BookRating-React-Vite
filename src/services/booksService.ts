import type { Book, BookFormData } from '../types/book'
import type { PagedResponse, PaginationParams } from '../types/api'
import { getUniqueBookCategories, sortBooksByRating } from '../utils/bookFilters'
import { ApiClientError, deleteJson, getJson, postJson, putJson } from './apiClient'
import { FULL_LIST_PAGE_SIZE, toPaginationQueryString } from './pagination'

export async function getBooksPage(pagination: PaginationParams = {}): Promise<PagedResponse<Book>> {
  return getJson<PagedResponse<Book>>(`/api/books?${toPaginationQueryString(pagination)}`)
}

export async function getBooks(): Promise<Book[]> {
  return getAllBookPages()
}

export async function getAdminBooks(
  authToken: string,
  pagination: PaginationParams = {},
): Promise<PagedResponse<Book>> {
  return getJson<PagedResponse<Book>>(`/api/admin/books?${toPaginationQueryString(pagination)}`, { authToken })
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    return await getJson<Book>(`/api/books/${encodeURIComponent(id)}`)
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return null
    }

    throw error
  }
}

export async function getBookCategories(): Promise<string[]> {
  const books = await getBooks()
  return getUniqueBookCategories(books)
}

export async function getTopRatedBooks(limit?: number): Promise<Book[]> {
  const books = await getBooks()
  const sortedBooks = sortBooksByRating(books)
  return typeof limit === 'number' ? sortedBooks.slice(0, limit) : sortedBooks
}

export async function createBook(book: BookFormData, authToken: string): Promise<Book> {
  return postJson<Book>('/api/books', normalizeBookPayload(book), { authToken })
}

export async function updateBook(id: string, book: BookFormData, authToken: string): Promise<Book> {
  return putJson<Book>(`/api/books/${encodeURIComponent(id)}`, normalizeBookPayload(book), { authToken })
}

export async function deleteBook(id: string, authToken: string): Promise<void> {
  return deleteJson(`/api/books/${encodeURIComponent(id)}`, { authToken })
}

function normalizeBookPayload(book: BookFormData): BookFormData {
  return {
    title: book.title.trim(),
    author: book.author.trim(),
    category: normalizeOptionalText(book.category),
    description: normalizeOptionalText(book.description),
    publishedYear: typeof book.publishedYear === 'number' ? book.publishedYear : undefined,
    coverImageUrl: normalizeOptionalText(book.coverImageUrl),
    status: book.status,
  }
}

function normalizeOptionalText(value?: string | null): string | undefined {
  const normalized = value?.trim()
  return normalized ? normalized : undefined
}

async function getAllBookPages(): Promise<Book[]> {
  const firstPage = await getBooksPage({ page: 1, pageSize: FULL_LIST_PAGE_SIZE })
  const items = [...firstPage.items]

  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const nextPage = await getBooksPage({ page, pageSize: FULL_LIST_PAGE_SIZE })
    items.push(...nextPage.items)
  }

  return items
}
