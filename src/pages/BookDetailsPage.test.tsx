import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../context/authState'
import { BookDetailsPage } from './BookDetailsPage'

const fetchMock = vi.fn()

function jsonResponse(body: unknown): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }),
  )
}

describe('BookDetailsPage', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockResolvedValue(jsonResponse({
      id: 'book-1',
      title: 'Algoritmlar',
      author: 'A. Muallif',
      category: 'Dasturlash',
      description: 'Algoritmlar haqida kitob.',
      publishedYear: null,
      coverImageUrl: null,
      averageRating: 4.5,
      ratingsCount: 8,
      status: 'Verified',
      recentRatings: [],
    }))
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    cleanup()
  })

  test('shows neutral missing published year text instead of TODO copy', async () => {
    render(
      <AuthContext.Provider value={{
        token: null,
        user: null,
        setSession: vi.fn(),
        logout: vi.fn(),
      }}>
        <MemoryRouter initialEntries={['/books/book-1']}>
          <Routes>
            <Route path="/books/:id" element={<BookDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Nashr yili kiritilmagan')).toBeTruthy()
    })
    expect(screen.queryByText(/TODO:/)).toBeNull()
  })
})
