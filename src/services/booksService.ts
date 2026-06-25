import type { Book, BookFormData } from '../types/book'
import type { PagedResponse, PaginationParams } from '../types/api'
import { ApiClientError, deleteJson, getJson, postJson, putJson } from './apiClient'
import { FULL_LIST_PAGE_SIZE, toPaginationQueryString } from './pagination'

export interface BookListParams extends PaginationParams {
  category?: string
}

export async function getBooksPage(pagination: BookListParams = {}): Promise<PagedResponse<Book>> {
  return getJson<PagedResponse<Book>>(`/api/books?${toBookListQueryString(pagination)}`)
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
  return getJson<string[]>('/api/books/categories')
}

export async function getTopRatedBooks(limit?: number): Promise<Book[]> {
  const params = new URLSearchParams()

  if (typeof limit === 'number') {
    params.set('limit', String(limit))
  }

  const queryString = params.toString()
  return getJson<Book[]>(`/api/books/top-rated${queryString ? `?${queryString}` : ''}`)
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

function toBookListQueryString(pagination: BookListParams = {}): string {
  const params = new URLSearchParams(toPaginationQueryString(pagination))
  const category = pagination.category?.trim()

  if (category) {
    params.set('category', category)
  }

  return params.toString()
}
