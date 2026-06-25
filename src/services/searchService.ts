import type { Book, BookSearchFilters } from '../types/book'
import type { PagedResponse, PaginationParams } from '../types/api'
import { getJson } from './apiClient'
import { getBooksPage } from './booksService'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './pagination'

export async function searchBooks(
  filters: BookSearchFilters,
  pagination: PaginationParams = {},
): Promise<PagedResponse<Book>> {
  const page = pagination.page ?? DEFAULT_PAGE
  const pageSize = pagination.pageSize ?? DEFAULT_PAGE_SIZE
  const query = filters.query.trim()
  if (!query) {
    return getBooksPage({ page, pageSize, category: filters.category })
  }

  const params = new URLSearchParams({
    q: query,
    page: String(page),
    pageSize: String(pageSize),
  })
  const category = filters.category?.trim()
  if (category) {
    params.set('category', category)
  }

  return getJson<PagedResponse<Book>>(`/api/books/search?${params.toString()}`)
}
