import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'

const fetchMock = vi.fn()

const topRatedBooks = [
  {
    id: 'book-1',
    title: 'Yuqori reytingli kitob',
    author: 'A. Muallif',
    category: 'Dasturlash',
    coverImageUrl: null,
    averageRating: 4.9,
    ratingsCount: 20,
    status: 'Verified',
  },
]

function jsonResponse(body: unknown): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }),
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input)

      if (url === 'http://localhost:5099/api/books/top-rated?limit=3') {
        return jsonResponse(topRatedBooks)
      }

      return Promise.reject(new Error(`Unexpected request: ${url}`))
    })
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    cleanup()
  })

  test('loads top-rated books with one backend request', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Yuqori reytingli kitob')).toBeTruthy()
    })

    const urls = fetchMock.mock.calls.map(([input]) => String(input))
    expect(urls).toEqual(['http://localhost:5099/api/books/top-rated?limit=3'])
  })
})
