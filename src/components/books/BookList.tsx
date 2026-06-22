import type { Book } from '../../types/book'
import { BookCard } from './BookCard'

interface BookListProps {
  books: Book[]
}

export function BookList({ books }: BookListProps) {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
