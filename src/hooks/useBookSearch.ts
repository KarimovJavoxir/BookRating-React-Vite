import { useEffect, useState } from 'react'
import { searchBooks } from '../services/searchService'
import type { Book } from '../types/book'
import { useDebounce } from './useDebounce'

interface BookSearchState {
  books: Book[]
  isLoading: boolean
  error: string | null
}

export function useBookSearch(query: string, category?: string): BookSearchState {
  const debouncedQuery = useDebounce(query, 300)
  const [state, setState] = useState<BookSearchState>({
    books: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let isCurrentRequest = true

    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }))

    searchBooks({ query: debouncedQuery, category })
      .then((books) => {
        if (!isCurrentRequest) {
          return
        }

        setState({
          books,
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
          isLoading: false,
          error: 'Kitoblarni qidirishda xatolik yuz berdi.',
        })
      })

    return () => {
      isCurrentRequest = false
    }
  }, [category, debouncedQuery])

  return state
}
