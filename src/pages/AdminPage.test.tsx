import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../context/authState'
import { AdminPage } from './AdminPage'

const fetchMock = vi.fn()

const adminSession = {
  token: 'admin-token',
  user: {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@example.com',
    profilePictureUrl: null,
    isAdmin: true,
  },
  setSession: vi.fn(),
  logout: vi.fn(),
}

function jsonResponse(body: unknown): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }),
  )
}

function emptyPage<T>(page = 1, totalCount = 0) {
  return {
    items: [] as T[],
    page,
    pageSize: 10,
    totalCount,
    totalPages: totalCount === 0 ? 0 : Math.ceil(totalCount / 10),
  }
}

function dashboardResponse() {
  return {
    totalBooks: 10,
    totalUsers: 3,
    totalRatings: 11,
    booksAddedInRange: 1,
    ratingsAddedInRange: 2,
    averageRatingInRange: 4.5,
    recentRatings: [],
  }
}

describe('AdminPage', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input)

      if (url.startsWith('http://localhost:5099/api/admin/dashboard')) {
        return jsonResponse(dashboardResponse())
      }

      if (url === 'http://localhost:5099/api/admin/books?page=1&pageSize=10') {
        return jsonResponse(emptyPage(1))
      }

      if (url === 'http://localhost:5099/api/admin/users?page=1&pageSize=10') {
        return jsonResponse(emptyPage(1))
      }

      if (url === 'http://localhost:5099/api/admin/ratings?page=1&pageSize=10') {
        return jsonResponse({
          items: [
            {
              id: 'rating-1',
              bookId: 'book-1',
              bookTitle: 'Algoritmlar',
              userId: 'user-1',
              username: 'user01',
              userProfilePictureUrl: null,
              value: 5,
              comment: 'Foydali',
              status: 'Banned',
              banReason: 'Spam izoh',
              createdAt: '2026-06-23T00:00:00Z',
            },
          ],
          page: 1,
          pageSize: 10,
          totalCount: 11,
          totalPages: 2,
        })
      }

      if (url === 'http://localhost:5099/api/admin/ratings?page=2&pageSize=10') {
        return jsonResponse(emptyPage(2, 11))
      }

      return Promise.reject(new Error(`Unexpected request: ${url}`))
    })
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    cleanup()
  })

  test('shows banned rating status with ban reason tooltip', async () => {
    render(
      <AuthContext.Provider value={adminSession}>
        <MemoryRouter>
          <AdminPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Dashboard statistikasi')).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Reytinglar' }))

    const statusBadge = await screen.findByLabelText('Banned: Spam izoh')
    expect(statusBadge.getAttribute('title')).toBe('Spam izoh')
  })

  test('rating pagination reloads only the ratings table', async () => {
    render(
      <AuthContext.Provider value={adminSession}>
        <MemoryRouter>
          <AdminPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Dashboard statistikasi')).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Reytinglar' }))

    await waitFor(() => {
      expect(screen.getByText('Algoritmlar')).toBeTruthy()
    })

    const callsBeforePagination = fetchMock.mock.calls.length
    fireEvent.click(screen.getByRole('button', { name: 'Keyingi sahifa' }))

    await waitFor(() => {
      const newUrls = fetchMock.mock.calls.slice(callsBeforePagination).map(([input]) => String(input))
      expect(newUrls).toEqual(['http://localhost:5099/api/admin/ratings?page=2&pageSize=10'])
    })
  })
})
