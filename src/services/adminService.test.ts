import { beforeEach, describe, expect, test, vi } from 'vitest'
import {
  acceptAdminRating,
  banAdminRating,
  getAdminDashboard,
  getAdminRatings,
  getAdminUsers,
} from './adminService'

const fetchMock = vi.fn()

function jsonResponse(body: unknown): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }),
  )
}

describe('adminService', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  test('loads users with admin token', async () => {
    const users = [
      {
        id: 'user-1',
        username: 'user01',
        email: 'user01@example.com',
        profilePictureUrl: null,
        isAdmin: false,
        createdAt: '2026-06-23T00:00:00Z',
        ratingsCount: 2,
      },
    ]
    const page = {
      items: users,
      page: 2,
      pageSize: 10,
      totalCount: 12,
      totalPages: 2,
    }
    fetchMock.mockResolvedValueOnce(jsonResponse(page))

    await expect(getAdminUsers('admin-token', { page: 2, pageSize: 10 })).resolves.toEqual(page)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/admin/users?page=2&pageSize=10', {
      headers: {
        Authorization: 'Bearer admin-token',
      },
    })
  })

  test('loads book ratings with admin token', async () => {
    const ratings = [
      {
        id: 'rating-1',
        bookId: 'book-1',
        bookTitle: 'Algoritmlar',
        userId: 'user-1',
        username: 'user01',
        userProfilePictureUrl: null,
        value: 5,
        comment: 'Foydali',
        createdAt: '2026-06-23T00:00:00Z',
      },
    ]
    const page = {
      items: ratings,
      page: 4,
      pageSize: 20,
      totalCount: 63,
      totalPages: 4,
    }
    fetchMock.mockResolvedValueOnce(jsonResponse(page))

    await expect(getAdminRatings('admin-token', { page: 4, pageSize: 20 })).resolves.toEqual(page)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/admin/ratings?page=4&pageSize=20', {
      headers: {
        Authorization: 'Bearer admin-token',
      },
    })
  })

  test('loads dashboard metrics with admin token and date range', async () => {
    const dashboard = {
      totalBooks: 10,
      totalUsers: 21,
      totalRatings: 45,
      booksAddedInRange: 3,
      ratingsAddedInRange: 8,
      averageRatingInRange: 4.25,
      recentRatings: [],
    }
    fetchMock.mockResolvedValueOnce(jsonResponse(dashboard))

    await expect(
      getAdminDashboard('admin-token', { from: '2026-06-01', to: '2026-06-23' }),
    ).resolves.toEqual(dashboard)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5099/api/admin/dashboard?from=2026-06-01&to=2026-06-23',
      {
        headers: {
          Authorization: 'Bearer admin-token',
        },
      },
    )
  })

  test('accepts a book rating with admin token', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))

    await expect(acceptAdminRating('admin-token', 'rating-1')).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/admin/ratings/rating-1/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer admin-token',
      },
      body: '{}',
    })
  })

  test('bans a book rating with admin token and reason', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))

    await expect(banAdminRating('admin-token', 'rating-2', 'Spam izoh')).resolves.toBeUndefined()
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5099/api/admin/ratings/rating-2/ban', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer admin-token',
      },
      body: JSON.stringify({ banReason: 'Spam izoh' }),
    })
  })
})
