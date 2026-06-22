import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { Book } from '../types/book'
import { calculateUpdatedBookRating, isRatingValue, submitBookRating } from './ratingsService'

const fetchMock = vi.fn()

const book: Book = {
  id: 'book-1',
  title: 'Test kitob',
  author: 'Namuna muallif',
  averageRating: 4,
  ratingsCount: 2,
}

function jsonResponse(body: unknown): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }),
  )
}

describe('ratingsService', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

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

  test('submits a rating to the backend and returns updated book details', async () => {
    const updatedBook = {
      ...book,
      averageRating: 4.3,
      ratingsCount: 3,
      recentRatings: [
        {
          id: 'rating-1',
          bookId: 'book-1',
          value: 5,
          comment: 'Foydali kitob',
          createdAt: '2026-06-23T00:00:00Z',
        },
      ],
    }
    fetchMock.mockResolvedValueOnce(jsonResponse(updatedBook))

    const result = await submitBookRating('book-1', {
      value: 5,
      comment: 'Foydali kitob',
    })

    expect(result).toEqual(updatedBook)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/books/book-1/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: 5,
        comment: 'Foydali kitob',
      }),
    })
  })
})
