import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookList } from '../components/books/BookList'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { PaginationControls } from '../components/common/PaginationControls'
import { getTopRatedBooks } from '../services/booksService'
import type { Book } from '../types/book'

const HOME_BOOKS_PAGE_SIZE = 3

export function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalPages = Math.ceil(books.length / HOME_BOOKS_PAGE_SIZE)
  const safeCurrentPage = totalPages === 0 ? 1 : Math.min(currentPage, totalPages)
  const visibleBooks = books.slice(
    (safeCurrentPage - 1) * HOME_BOOKS_PAGE_SIZE,
    safeCurrentPage * HOME_BOOKS_PAGE_SIZE,
  )

  useEffect(() => {
    let isCurrentRequest = true

    getTopRatedBooks()
      .then((items) => {
        if (!isCurrentRequest) {
          return
        }

        setBooks(items)
        setCurrentPage(1)
        setError(null)
      })
      .catch(() => {
        if (!isCurrentRequest) {
          return
        }

        setError('Yuqori reytingli kitoblarni yuklashda xatolik yuz berdi.')
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      })

    return () => {
      isCurrentRequest = false
    }
  }, [])

  return (
    <div className="page-stack">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Diplom loyihasi frontend bosqichi</p>
          <h1>Axborot resurs markazi kitoblari reytingi</h1>
          <p>
            Kitoblarni koʻrish, qidirish, batafsil maʼlumot olish va 1 dan 5 gacha
            baholash imkonini beruvchi React frontend.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/books">
              Kitoblarni koʻrish
            </Link>
          </div>
        </div>
        <div className="hero-panel" aria-label="Tizim imkoniyatlari">
          <div>
            <strong>Live search</strong>
            <span>Debounce bilan qidirish</span>
          </div>
          <div>
            <strong>Rating UI</strong>
            <span>1-5 oraligʻida baholash</span>
          </div>
          <div>
            <strong>Backend API</strong>
            <span>ASP.NET Core orqali maʼlumot olish</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Backend maʼlumotlari</p>
            <h2>Yuqori reytingli kitoblar</h2>
          </div>
          <Link className="text-link" to="/books">
            Barcha kitoblar
          </Link>
        </div>

        {isLoading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!isLoading && !error && books.length === 0 ? (
          <EmptyState title="Kitoblar topilmadi" description="Backend API kitoblar roʻyxatini qaytarmadi." />
        ) : null}
        {!isLoading && !error && books.length > 0 ? (
          <>
            <BookList books={visibleBooks} />
            <PaginationControls
              currentPage={safeCurrentPage}
              pageSize={HOME_BOOKS_PAGE_SIZE}
              totalCount={books.length}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : null}
      </section>
    </div>
  )
}
