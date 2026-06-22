import type { Book } from '../types/book'
import { getUniqueBookCategories, sortBooksByRating } from '../utils/bookFilters'
import { ApiClientError, getJson } from './apiClient'

export async function getBooks(): Promise<Book[]> {
  return getJson<Book[]>('/api/books')
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
