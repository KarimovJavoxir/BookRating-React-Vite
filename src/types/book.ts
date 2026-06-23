import type { BookRating } from './rating'

export interface Book {
  id: string
  title: string
  author: string
  category?: string | null
  description?: string | null
  publishedYear?: number | null
  coverImageUrl?: string | null
  averageRating: number
  ratingsCount: number
  status?: BookStatus
  recentRatings?: BookRating[]
}

export interface BookSearchFilters {
  query: string
  category?: string
}

export interface BookFormData {
  title: string
  author: string
  category?: string | null
  description?: string | null
  publishedYear?: number | null
  coverImageUrl?: string | null
  status: BookStatus
}

export type BookStatus = 'New' | 'Banned' | 'Verified'
