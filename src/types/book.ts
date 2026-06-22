export interface Book {
  id: string
  title: string
  author: string
  category?: string
  description?: string
  publishedYear?: number
  coverImageUrl?: string
  averageRating: number
  ratingsCount: number
}

export interface BookSearchFilters {
  query: string
  category?: string
}
