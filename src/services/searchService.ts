import type { Book, BookSearchFilters } from '../types/book'
import { filterBooksByQueryAndCategory, sortBooksByRating } from '../utils/bookFilters'
import { getJson } from './apiClient'
import { getBooks } from './booksService'

export async function searchBooks(filters: BookSearchFilters): Promise<Book[]> {
  const query = filters.query.trim()
  const books = query
    ? await getJson<Book[]>(`/api/books/search?q=${encodeURIComponent(query)}`)
    : await getBooks()

  return sortBooksByRating(
    filterBooksByQueryAndCategory(books, {
      query: '',
      category: filters.category,
    }),
  )
}
