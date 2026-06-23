import type { Book, BookFormData } from '../types/book'
import { getUniqueBookCategories, sortBooksByRating } from '../utils/bookFilters'
import { ApiClientError, deleteJson, getJson, postJson, putJson } from './apiClient'

export async function getBooks(): Promise<Book[]> {
  return getJson<Book[]>('/api/books')
}

export async function getAdminBooks(authToken: string): Promise<Book[]> {
  return getJson<Book[]>('/api/admin/books', { authToken })
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

export async function getTopRatedBooks(limit = 3): Promise<Book[]> {
  const books = await getBooks()
  return sortBooksByRating(books).slice(0, limit)
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
