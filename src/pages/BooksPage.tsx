import { useEffect, useState } from 'react'
import { BookList } from '../components/books/BookList'
import { CategoryFilter } from '../components/books/CategoryFilter'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { PaginationControls } from '../components/common/PaginationControls'
import { SearchInput } from '../components/search/SearchInput'
import { useBookSearch } from '../hooks/useBookSearch'
import { getBookCategories } from '../services/booksService'

const BOOKS_PAGE_SIZE = 9

export function BooksPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<string[]>([])
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const { books, isLoading, error } = useBookSearch(query, selectedCategory)
  const totalPages = Math.ceil(books.length / BOOKS_PAGE_SIZE)
  const safeCurrentPage = totalPages === 0 ? 1 : Math.min(currentPage, totalPages)
  const visibleBooks = books.slice(
    (safeCurrentPage - 1) * BOOKS_PAGE_SIZE,
    safeCurrentPage * BOOKS_PAGE_SIZE,
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [query, selectedCategory])

  useEffect(() => {
    let isCurrentRequest = true

    getBookCategories()
      .then((items) => {
        if (!isCurrentRequest) {
          return
        }

        setCategories(items)
        setCategoryError(null)
      })
      .catch(() => {
        if (!isCurrentRequest) {
          return
        }

        setCategoryError('Kategoriyalarni yuklashda xatolik yuz berdi.')
      })

    return () => {
      isCurrentRequest = false
    }
  }, [])

  return (
    <div className="page-stack">
      <section className="page-heading">
        <p className="eyebrow">Kitoblar katalogi</p>
        <h1>Kitoblarni qidirish va koʻrish</h1>
        <p>
          Kitoblar roʻyxati va live search natijalari ASP.NET Core backend API orqali
          yuklanadi.
        </p>
      </section>

      <section className="toolbar" aria-label="Kitoblarni qidirish va saralash">
        <SearchInput value={query} onChange={setQuery} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />
      </section>

      <section className="section-block">
        <div className="result-summary">
          <strong>{books.length}</strong>
          <span>ta kitob topildi</span>
        </div>

        {categoryError ? <ErrorState message={categoryError} /> : null}
        {isLoading ? <LoadingState message="Kitoblar qidirilmoqda..." /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!isLoading && !error && books.length === 0 ? (
          <EmptyState
            title="Mos kitob topilmadi"
            description="Qidiruv soʻzini oʻzgartiring yoki boshqa kategoriya tanlang."
          />
        ) : null}
        {!isLoading && !error && books.length > 0 ? (
          <>
            <BookList books={visibleBooks} />
            <PaginationControls
              currentPage={safeCurrentPage}
              pageSize={BOOKS_PAGE_SIZE}
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
