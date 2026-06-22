import type { Book, BookSearchFilters } from '../types/book'

function isDefinedCategory(category: string | null | undefined): category is string {
  return typeof category === 'string' && category.length > 0
}

export function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase('uz-UZ')
}

export function filterBooksByQueryAndCategory(
  books: Book[],
  filters: BookSearchFilters,
): Book[] {
  const query = normalizeSearchText(filters.query)
  const category = filters.category

  return books.filter((book) => {
    const matchesCategory = !category || book.category === category
    const searchableText = normalizeSearchText(
      [book.title, book.author, book.category, book.description].filter(Boolean).join(' '),
    )
    const matchesQuery = !query || searchableText.includes(query)

    return matchesCategory && matchesQuery
  })
}

export function getUniqueBookCategories(books: Book[]): string[] {
  const categories = books.map((book) => book.category).filter(isDefinedCategory)

  return Array.from(new Set(categories)).sort((first, second) =>
    first.localeCompare(second, 'uz-UZ'),
  )
}

export function sortBooksByRating(books: Book[]): Book[] {
  return [...books].sort((first, second) => {
    if (second.averageRating === first.averageRating) {
      return second.ratingsCount - first.ratingsCount
    }

    return second.averageRating - first.averageRating
  })
}
