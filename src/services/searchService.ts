import { mockBooks } from './mock/mockBooks'
import { mockDelay } from './mock/mockDelay'
import type { Book, BookSearchFilters } from '../types/book'
import { filterBooksByQueryAndCategory, sortBooksByRating } from '../utils/bookFilters'

export async function searchBooks(filters: BookSearchFilters): Promise<Book[]> {
  await mockDelay(320)
  return sortBooksByRating(filterBooksByQueryAndCategory(mockBooks, filters))
}
