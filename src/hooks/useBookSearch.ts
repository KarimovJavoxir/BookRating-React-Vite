import { useEffect, useState } from 'react'
import { searchBooks } from '../services/searchService'
import type { Book } from '../types/book'
import { useDebounce } from './useDebounce'

interface BookSearchState {
  books: Book[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  isLoading: boolean
  error: string | null
}

export function useBookSearch(
  query: string,
  category: string | undefined,
  page: number,
  pageSize: number,
): BookSearchState {
  const debouncedQuery = useDebounce(query, 300)
  const [state, setState] = useState<BookSearchState>({
    books: [],
    page,
    pageSize,
    totalCount: 0,
    totalPages: 0,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let isCurrentRequest = true

    setState((currentState) => ({
      ...currentState,
      page,
      pageSize,
      isLoading: true,
      error: null,
    }))

    searchBooks({ query: debouncedQuery, category }, { page, pageSize })
      .then((result) => {
        if (!isCurrentRequest) {
          return
        }

        setState({
          books: result.items,
          page: result.page,
          pageSize: result.pageSize,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          isLoading: false,
          error: null,
        })
      })
      .catch(() => {
        if (!isCurrentRequest) {
          return
        }

        setState({
          books: [],
          page,
          pageSize,
          totalCount: 0,
          totalPages: 0,
          isLoading: false,
          error: 'Kitoblarni qidirishda xatolik yuz berdi.',
        })
      })

    return () => {
      isCurrentRequest = false
    }
  }, [category, debouncedQuery, page, pageSize])

  return state
}
