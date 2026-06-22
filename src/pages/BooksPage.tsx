import { useEffect, useState } from 'react'
import { BookList } from '../components/books/BookList'
import { CategoryFilter } from '../components/books/CategoryFilter'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { SearchInput } from '../components/search/SearchInput'
import { useBookSearch } from '../hooks/useBookSearch'
import { getBookCategories } from '../services/booksService'

export function BooksPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [categories, setCategories] = useState<string[]>([])
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const { books, isLoading, error } = useBookSearch(query, selectedCategory)

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
          Qidiruv maydoni backend tayyor boʻlganda Meilisearch yoki ASP.NET Core API orqali ishlashga
          moslashtiriladi.
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
        <section className="section-block">
          <div className="result-summary">
            <strong>{books.length}</strong>
            <span>ta kitob topildi</span>
          </div>
          <BookList books={books} />
        </section>
      ) : null}
    </div>
  )
}
