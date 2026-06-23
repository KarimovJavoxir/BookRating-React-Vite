export interface AdminUser {
  id: string
  username: string
  email: string
  profilePictureUrl?: string | null
  isAdmin: boolean
  createdAt: string
  ratingsCount: number
}

export interface AdminBookRating {
  id: string
  bookId: string
  bookTitle: string
  userId: string
  username: string
  userProfilePictureUrl?: string | null
  value: number
  comment?: string | null
  createdAt: string
}

export interface AdminDashboard {
  totalBooks: number
  totalUsers: number
  totalRatings: number
  booksAddedInRange: number
  ratingsAddedInRange: number
  averageRatingInRange: number
  recentRatings: AdminBookRating[]
}

export interface AdminDashboardFilters {
  from?: string
  to?: string
}
