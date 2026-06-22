import { mockBooks } from './mock/mockBooks'
import { mockDelay } from './mock/mockDelay'
import type { Book } from '../types/book'
import { getUniqueBookCategories, sortBooksByRating } from '../utils/bookFilters'

export async function getBooks(): Promise<Book[]> {
  await mockDelay()
  return [...mockBooks]
}

export async function getBookById(id: string): Promise<Book | null> {
  await mockDelay()
  return mockBooks.find((book) => book.id === id) ?? null
}

export async function getBookCategories(): Promise<string[]> {
  await mockDelay(150)
  return getUniqueBookCategories(mockBooks)
}

export async function getTopRatedBooks(limit = 3): Promise<Book[]> {
  await mockDelay(150)
  return sortBooksByRating(mockBooks).slice(0, limit)
}
