import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { BooksPage } from './BooksPage'

const fetchMock = vi.fn()

const apiBooks = Array.from({ length: 9 }, (_, index) => ({
  id: `book-${index + 1}`,
  title: `Kitob ${index + 1}`,
  author: 'A. Muallif',
  category: 'Dasturlash',
  coverImageUrl: null,
  averageRating: 4.5,
  ratingsCount: 5,
  status: 'Verified',
}))

function jsonResponse(body: unknown): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }),
  )
}

describe('BooksPage', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input)

      if (url === 'http://localhost:5099/api/books?page=1&pageSize=9') {
        return jsonResponse({
          items: apiBooks,
          page: 1,
          pageSize: 9,
          totalCount: 540,
          totalPages: 60,
        })
      }

      if (url === 'http://localhost:5099/api/books/categories') {
        return jsonResponse(['Dasturlash'])
      }

      return Promise.reject(new Error(`Unexpected request: ${url}`))
    })
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    cleanup()
  })

  test('loads only the first visible books page on initial render', async () => {
    render(
      <MemoryRouter>
        <BooksPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('1-9 / 540 ta yozuv')).toBeTruthy()
    })

    const urls = fetchMock.mock.calls.map(([input]) => String(input))
    expect(urls).toHaveLength(2)
    expect(urls).toContain('http://localhost:5099/api/books?page=1&pageSize=9')
    expect(urls).toContain('http://localhost:5099/api/books/categories')
    expect(urls.some((url) => url.includes('page=2'))).toBe(false)
  })
})
