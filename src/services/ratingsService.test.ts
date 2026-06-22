import { describe, expect, test } from 'vitest'
import type { Book } from '../types/book'
import { calculateUpdatedBookRating, isRatingValue } from './ratingsService'

const book: Book = {
  id: 'book-1',
  title: 'Test kitob',
  author: 'Namuna muallif',
  averageRating: 4,
  ratingsCount: 2,
}

describe('ratingsService', () => {
  test('accepts rating values only from 1 to 5', () => {
    expect(isRatingValue(1)).toBe(true)
    expect(isRatingValue(5)).toBe(true)
    expect(isRatingValue(0)).toBe(false)
    expect(isRatingValue(6)).toBe(false)
    expect(isRatingValue(3.5)).toBe(false)
  })

  test('updates average rating and rating count after a new rating', () => {
    const updatedBook = calculateUpdatedBookRating(book, 5)

    expect(updatedBook.averageRating).toBe(4.3)
    expect(updatedBook.ratingsCount).toBe(3)
  })
})
