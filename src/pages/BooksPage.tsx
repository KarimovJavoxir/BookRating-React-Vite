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
  const { books, pageSize, totalCount, totalPages, isLoading, error } = useBookSearch(
    query,
    selectedCategory,
    currentPage,
    BOOKS_PAGE_SIZE,
  )

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery)
    setCurrentPage(1)
  }

  function handleCategoryChange(nextCategory?: string) {
    setSelectedCategory(nextCategory)
    setCurrentPage(1)
  }

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

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1)
      return
    }

    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, isLoading, totalPages])

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
        <SearchInput value={query} onChange={handleQueryChange} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={handleCategoryChange}
        />
      </section>

      <section className="section-block">
        <div className="result-summary">
          <strong>{totalCount}</strong>
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
            <BookList books={books} />
            <PaginationControls
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : null}
      </section>
    </div>
  )
}
