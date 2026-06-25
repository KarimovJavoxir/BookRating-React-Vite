import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookCover } from '../components/books/BookCover'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { UserAvatar } from '../components/common/UserAvatar'
import { RatingForm } from '../components/rating/RatingForm'
import { RatingStars } from '../components/rating/RatingStars'
import { useAuth } from '../context/useAuth'
import { getBookById } from '../services/booksService'
import { submitBookRating } from '../services/ratingsService'
import type { Book } from '../types/book'
import type { RatingSubmission } from '../types/rating'

export function BookDetailsPage() {
  const { id } = useParams()
  const { token } = useAuth()
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

    if (!token) {
      throw new Error('Baholash uchun tizimga kirish kerak.')
    }

    const updatedBook = await submitBookRating(book.id, submission, token)
    setBook(updatedBook)
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
        description="Ushbu identifikator boʻyicha backend API kitob qaytarmadi."
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
              <dd>{book.publishedYear ?? 'Nashr yili kiritilmagan'}</dd>
            </div>
            <div>
              <dt>Maʼlumot manbasi</dt>
              <dd>ASP.NET Core API</dd>
            </div>
          </dl>
        </div>
      </section>

      {book.recentRatings?.length ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Soʻnggi baholar</p>
              <h2>Foydalanuvchi fikrlari</h2>
            </div>
          </div>
          <div className="ratings-list">
            {book.recentRatings.map((rating) => (
              <article key={rating.id} className="rating-item">
                <div className="rating-user">
                  <UserAvatar username={rating.username} profilePictureUrl={rating.userProfilePictureUrl} />
                  <div>
                    <strong>{rating.username ?? 'Foydalanuvchi'}</strong>
                    <span>{rating.value} / 5</span>
                  </div>
                </div>
                {rating.comment ? <p>{rating.comment}</p> : <p>Izoh qoldirilmagan.</p>}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section-block rating-section">
        <div>
          <p className="eyebrow">Foydalanuvchi bahosi</p>
          <h2>Reyting yuborish</h2>
        </div>
        {token ? (
          <RatingForm onSubmit={handleRatingSubmit} />
        ) : (
          <div className="auth-required">
            <p>Kitobga reyting qoldirish uchun avval tizimga kiring.</p>
            <Link className="primary-button" to="/login">
              Kirish
            </Link>
          </div>
        )}
      </section>
    </article>
  )
}
