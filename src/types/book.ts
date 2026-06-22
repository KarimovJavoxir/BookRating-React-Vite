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
  recentRatings?: BookRating[]
}

export interface BookSearchFilters {
  query: string
  category?: string
}
