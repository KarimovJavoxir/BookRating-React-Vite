import { describe, expect, test } from 'vitest'
import type { Book } from '../types/book'
import {
  filterBooksByQueryAndCategory,
  getUniqueBookCategories,
  sortBooksByRating,
} from './bookFilters'

const books: Book[] = [
  {
    id: '1',
    title: 'Web dasturlash',
    author: 'Namuna muallif',
    category: 'Dasturlash',
    averageRating: 4.2,
    ratingsCount: 8,
  },
  {
    id: '2',
    title: 'Maʼlumotlar bazasi',
    author: 'Namuna muallif',
    category: 'Maʼlumotlar bazasi',
    averageRating: 4.8,
    ratingsCount: 5,
  },
  {
    id: '3',
    title: 'Axborot xavfsizligi',
    author: 'Namuna muallif',
    category: 'Axborot xavfsizligi',
    averageRating: 4.8,
    ratingsCount: 11,
  },
]

describe('bookFilters', () => {
  test('filters books by query text across title and category', () => {
    const result = filterBooksByQueryAndCategory(books, {
      query: 'baza',
    })

    expect(result.map((book) => book.id)).toEqual(['2'])
  })

  test('filters books by selected category', () => {
    const result = filterBooksByQueryAndCategory(books, {
      query: '',
      category: 'Dasturlash',
    })

    expect(result.map((book) => book.id)).toEqual(['1'])
  })

  test('returns unique categories in Uzbek locale order', () => {
    expect(getUniqueBookCategories(books)).toEqual([
      'Axborot xavfsizligi',
      'Dasturlash',
      'Maʼlumotlar bazasi',
    ])
  })

  test('sorts books by rating and then by rating count', () => {
    expect(sortBooksByRating(books).map((book) => book.id)).toEqual(['3', '2', '1'])
  })
})
