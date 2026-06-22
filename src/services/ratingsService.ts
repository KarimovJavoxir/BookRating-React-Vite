import type { Book } from '../types/book'
import type { RatingSubmission, RatingValue } from '../types/rating'
import { postJson } from './apiClient'

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
): Promise<Book> {
  if (!isRatingValue(submission.value)) {
    throw new Error('Reyting qiymati 1 dan 5 gacha boʻlishi kerak.')
  }

  return postJson<Book>(`/api/books/${encodeURIComponent(bookId)}/ratings`, {
    value: submission.value,
    comment: submission.comment?.trim() || undefined,
  })
}
