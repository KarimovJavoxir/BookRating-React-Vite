export type RatingValue = 1 | 2 | 3 | 4 | 5

export type BookRatingStatus = 'New' | 'Verified' | 'Banned' | 'NeedsHumanReview'

export interface BookRating {
  id: string
  bookId: string
  userId?: string
  username?: string | null
  userProfilePictureUrl?: string | null
  value: number
  comment?: string
  status?: BookRatingStatus
  banReason?: string | null
  createdAt: string
}

export interface RatingSubmission {
  value: RatingValue
  comment?: string
}
