import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookCover } from '../components/books/BookCover'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { RatingForm } from '../components/rating/RatingForm'
import { RatingStars } from '../components/rating/RatingStars'
import { getBookById } from '../services/booksService'
import { calculateUpdatedBookRating, submitBookRating } from '../services/ratingsService'
import type { Book } from '../types/book'
import type { RatingSubmission } from '../types/rating'

export function BookDetailsPage() {
  const { id } = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrentRequest = true

    if (!id) {
      setIsLoading(false)
      setError('Kitob identifikatori topilmadi.')
      return
    }

    setIsLoading(true)
    getBookById(id)
      .then((item) => {
        if (!isCurrentRequest) {
          return
        }

        setBook(item)
        setError(null)
      })
      .catch(() => {
        if (!isCurrentRequest) {
          return
        }

        setError('Kitob maʼlumotlarini yuklashda xatolik yuz berdi.')
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      })

    return () => {
      isCurrentRequest = false
    }
  }, [id])

  async function handleRatingSubmit(submission: RatingSubmission): Promise<void> {
    if (!book) {
      return
    }

    await submitBookRating(book.id, submission)
    setBook((currentBook) =>
      currentBook ? calculateUpdatedBookRating(currentBook, submission.value) : currentBook,
    )
  }

  if (isLoading) {
    return <LoadingState message="Kitob maʼlumotlari yuklanmoqda..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (!book) {
    return (
      <EmptyState
        title="Kitob topilmadi"
        description="Ushbu identifikator boʻyicha mock maʼlumotlar ichida kitob mavjud emas."
      />
    )
  }

  return (
    <article className="details-page">
      <Link className="text-link" to="/books">
        Kitoblar roʻyxatiga qaytish
      </Link>

      <section className="book-details">
        <BookCover book={book} />
        <div className="book-details__content">
          <p className="book-category">{book.category ?? 'Kategoriya kiritilmagan'}</p>
          <h1>{book.title}</h1>
          <p className="book-author">{book.author}</p>
          <RatingStars value={book.averageRating} ratingsCount={book.ratingsCount} />
          {book.description ? <p className="book-description">{book.description}</p> : null}
          <dl className="metadata-list">
            <div>
              <dt>Nashr yili</dt>
              <dd>{book.publishedYear ?? 'TODO: Nashr yili aniqlashtiriladi.'}</dd>
            </div>
            <div>
              <dt>Maʼlumot manbasi</dt>
              <dd>Mock service</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section-block rating-section">
        <div>
          <p className="eyebrow">Foydalanuvchi bahosi</p>
          <h2>Reyting yuborish</h2>
        </div>
        <RatingForm onSubmit={handleRatingSubmit} />
      </section>
    </article>
  )
}
