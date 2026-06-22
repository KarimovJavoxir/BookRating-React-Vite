import type { Book } from '../types/book'
import type { BookRating, RatingSubmission, RatingValue } from '../types/rating'
import { mockDelay } from './mock/mockDelay'

export function isRatingValue(value: number): value is RatingValue {
  return Number.isInteger(value) && value >= 1 && value <= 5
}

export function calculateUpdatedBookRating(book: Book, value: RatingValue): Book {
  const currentTotal = book.averageRating * book.ratingsCount
  const nextCount = book.ratingsCount + 1
  const nextAverage = Number(((currentTotal + value) / nextCount).toFixed(1))

  return {
    ...book,
    averageRating: nextAverage,
    ratingsCount: nextCount,
  }
}

export async function submitBookRating(
  bookId: string,
  submission: RatingSubmission,
): Promise<BookRating> {
  await mockDelay(300)

  if (!isRatingValue(submission.value)) {
    throw new Error('Reyting qiymati 1 dan 5 gacha boʻlishi kerak.')
  }

  return {
    id: `mock-rating-${Date.now()}`,
    bookId,
    value: submission.value,
    comment: submission.comment?.trim() || undefined,
    createdAt: new Date().toISOString(),
  }
}
