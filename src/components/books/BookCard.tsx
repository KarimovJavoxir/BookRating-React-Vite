import { Link } from 'react-router-dom'
import type { Book } from '../../types/book'
import { RatingStars } from '../rating/RatingStars'
import { BookCover } from './BookCover'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="book-card">
      <BookCover book={book} />
      <div className="book-card__content">
        <div>
          <p className="book-category">{book.category ?? 'Kategoriya kiritilmagan'}</p>
          <h2>{book.title}</h2>
          <p className="book-author">{book.author}</p>
        </div>

        <RatingStars value={book.averageRating} ratingsCount={book.ratingsCount} compact />

        <Link className="secondary-button" to={`/books/${book.id}`}>
          Batafsil
        </Link>
      </div>
    </article>
  )
}
