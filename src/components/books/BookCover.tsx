import type { Book } from '../../types/book'

interface BookCoverProps {
  book: Book
}

export function BookCover({ book }: BookCoverProps) {
  if (book.coverImageUrl) {
    return <img className="book-cover" src={book.coverImageUrl} alt={`${book.title} muqovasi`} />
  }

  return (
    <div className="book-cover book-cover--placeholder" aria-hidden="true">
      <span>{book.title.slice(0, 2).toLocaleUpperCase('uz-UZ')}</span>
    </div>
  )
}
