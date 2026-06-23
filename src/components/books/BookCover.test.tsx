import { fireEvent, render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { BookCover } from './BookCover'
import type { Book } from '../../types/book'

const book: Book = {
  id: 'book-1',
  title: 'Algoritmlar',
  author: 'Muallif',
  averageRating: 4.5,
  ratingsCount: 2,
  coverImageUrl: '/uploads/books/missing.jpg',
}

describe('BookCover', () => {
  test('uses the backend API base URL for relative cover image paths', () => {
    const { container } = render(<BookCover book={book} />)
    const image = container.querySelector('img')

    expect(image?.src).toBe('http://localhost:5099/uploads/books/missing.jpg')
    expect(image?.getAttribute('style')).toBeNull()
    expect(container.querySelector('.skeleton-box')).toBeTruthy()
  })

  test('hides the skeleton after the cover image loads', () => {
    const { container } = render(<BookCover book={book} />)
    const image = container.querySelector('img')

    fireEvent.load(image as HTMLImageElement)

    expect(container.querySelector('.skeleton-box')).toBeNull()
    expect(image?.classList.contains('fade-in')).toBe(true)
  })

  test('falls back to a placeholder when the cover image fails to load', () => {
    const { container } = render(<BookCover book={book} />)
    const image = container.querySelector('img')

    expect(image?.alt).toBe('Algoritmlar muqovasi')
    fireEvent.error(image as HTMLImageElement)

    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toContain('A')
  })
})
