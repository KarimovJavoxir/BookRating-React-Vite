export type RatingValue = 1 | 2 | 3 | 4 | 5

export interface BookRating {
  id: string
  bookId: string
  value: number
  comment?: string
  createdAt: string
}

export interface RatingSubmission {
  value: RatingValue
  comment?: string
}
