import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { UserAvatar } from '../components/common/UserAvatar'
import { useAuth } from '../context/useAuth'
import { getAdminDashboard, getAdminRatings, getAdminUsers } from '../services/adminService'
import { createBook, deleteBook, getAdminBooks, updateBook } from '../services/booksService'
import type { AdminBookRating, AdminDashboard, AdminUser } from '../types/admin'
import type { Book, BookFormData } from '../types/book'

type AdminTab = 'dashboard' | 'books' | 'ratings' | 'users'

const emptyBookForm: BookFormData = {
  title: '',
  author: '',
  category: '',
  description: '',
  publishedYear: null,
  coverImageUrl: '',
  status: 'New',
}

export function AdminPage() {
  const { token, user } = useAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [books, setBooks] = useState<Book[]>([])
  const [ratings, setRatings] = useState<AdminBookRating[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [dateRange, setDateRange] = useState(() => getDefaultDateRange())
  const [form, setForm] = useState<BookFormData>(emptyBookForm)
  const [editingBookId, setEditingBookId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAdminData = useCallback(async (authToken: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const [dashboardData, bookItems, ratingItems, userItems] = await Promise.all([
        getAdminDashboard(authToken, dateRange),
        getAdminBooks(authToken),
        getAdminRatings(authToken),
        getAdminUsers(authToken),
      ])
      setDashboard(dashboardData)
      setBooks(bookItems)
      setRatings(ratingItems)
      setUsers(userItems)
    } catch {
      setError('Admin maʼlumotlarini yuklashda xatolik yuz berdi.')
    } finally {
      setIsLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    if (!token || !user?.isAdmin) {
      setIsLoading(false)
      return
    }

    void loadAdminData(token)
  }, [loadAdminData, token, user?.isAdmin])

  async function handleDashboardFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) {
      return
    }

    setError(null)
    try {
      setDashboard(await getAdminDashboard(token, dateRange))
    } catch {
      setError('Dashboard maʼlumotlarini yangilashda xatolik yuz berdi.')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      if (editingBookId) {
        await updateBook(editingBookId, form, token)
      } else {
        await createBook(form, token)
      }

      resetForm()
      await loadAdminData(token)
    } catch {
      setError('Kitob maʼlumotlarini saqlashda xatolik yuz berdi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(bookId: string) {
    if (!token || !confirm('Kitobni oʻchirishni tasdiqlaysizmi?')) {
      return
    }

    setError(null)
    try {
      await deleteBook(bookId, token)
      await loadAdminData(token)
    } catch {
      setError('Kitobni oʻchirishda xatolik yuz berdi.')
    }
  }

  function startEdit(book: Book) {
    setEditingBookId(book.id)
    setForm({
      title: book.title,
      author: book.author,
      category: book.category ?? '',
      description: book.description ?? '',
      publishedYear: book.publishedYear ?? null,
      coverImageUrl: book.coverImageUrl ?? '',
      status: book.status ?? 'New',
    })
    setActiveTab('books')
  }

  function resetForm() {
    setEditingBookId(null)
    setForm(emptyBookForm)
  }

  if (!token) {
    return (
      <EmptyState
        title="Admin panel uchun kirish kerak"
        description="Kitoblarni boshqarish va jadvallarni koʻrish uchun admin akkaunt bilan tizimga kiring."
      />
    )
  }

  if (!user?.isAdmin) {
    return (
      <EmptyState
        title="Admin huquqi kerak"
        description="Bu sahifa faqat administrator foydalanuvchilar uchun ochiq."
      />
    )
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <p className="eyebrow">Admin panel</p>
        <h1>Kitoblar, reytinglar va foydalanuvchilar</h1>
        <p>Administrator kitoblarni qoʻshishi, tahrirlashi va oʻchirishi mumkin.</p>
      </section>

      <div className="tab-list" role="tablist" aria-label="Admin panel boʻlimlari">
        <button type="button" className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          Dashboard
        </button>
        <button type="button" className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>
          Kitoblar
        </button>
        <button type="button" className={activeTab === 'ratings' ? 'active' : ''} onClick={() => setActiveTab('ratings')}>
          Reytinglar
        </button>
        <button type="button" className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          Foydalanuvchilar
        </button>
      </div>

      {isLoading ? <LoadingState message="Admin maʼlumotlari yuklanmoqda..." /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!isLoading && activeTab === 'dashboard' && dashboard ? (
        <DashboardPanel
          dashboard={dashboard}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onSubmit={handleDashboardFilterSubmit}
        />
      ) : null}

      {!isLoading && activeTab === 'books' ? (
        <section className="admin-grid">
          <form className="section-block stack-form" onSubmit={handleSubmit}>
            <div>
              <p className="eyebrow">{editingBookId ? 'Tahrirlash' : 'Yangi kitob'}</p>
              <h2>{editingBookId ? 'Kitobni yangilash' : 'Kitob qoʻshish'}</h2>
            </div>
            <label>
              <span>Nomi</span>
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </label>
            <label>
              <span>Muallif</span>
              <input value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} required />
            </label>
            <label>
              <span>Kategoriya</span>
              <input value={form.category ?? ''} onChange={(event) => setForm({ ...form, category: event.target.value })} />
            </label>
            <label>
              <span>Tavsif</span>
              <textarea
                rows={4}
                value={form.description ?? ''}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </label>
            <label>
              <span>Nashr yili</span>
              <input
                type="number"
                value={form.publishedYear ?? ''}
                onChange={(event) =>
                  setForm({
                    ...form,
                    publishedYear: event.target.value ? Number(event.target.value) : null,
                  })
                }
              />
            </label>
            <label>
              <span>Muqova URL</span>
              <input
                value={form.coverImageUrl ?? ''}
                onChange={(event) => setForm({ ...form, coverImageUrl: event.target.value })}
              />
            </label>
            <label>
              <span>Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as BookFormData['status'] })}
              >
                <option value="New">New</option>
                <option value="Verified">Verified</option>
                <option value="Banned">Banned</option>
              </select>
            </label>
            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saqlanmoqda...' : editingBookId ? 'Yangilash' : 'Qoʻshish'}
              </button>
              {editingBookId ? (
                <button className="secondary-button" type="button" onClick={resetForm}>
                  Bekor qilish
                </button>
              ) : null}
            </div>
          </form>

          <section className="section-block table-panel">
            <h2>Kitoblar jadvali</h2>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Nomi</th>
                    <th>Muallif</th>
                    <th>Kategoriya</th>
                    <th>Status</th>
                    <th>Reyting</th>
                    <th>Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td><Link className="text-link" to={`/books/${book.id}`}>{book.title}</Link></td>
                      <td>{book.author}</td>
                      <td>{book.category ?? '-'}</td>
                      <td>{book.status ?? 'New'}</td>
                      <td>{book.averageRating.toFixed(1)} ({book.ratingsCount})</td>
                      <td>
                        <div className="row-actions">
                          <button className="secondary-button" type="button" onClick={() => startEdit(book)}>
                            Tahrirlash
                          </button>
                          <button className="danger-button" type="button" onClick={() => void handleDelete(book.id)}>
                            Oʻchirish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      ) : null}

      {!isLoading && activeTab === 'ratings' ? <RatingsTable ratings={ratings} /> : null}
      {!isLoading && activeTab === 'users' ? <UsersTable users={users} /> : null}
    </div>
  )
}

function DashboardPanel({
  dashboard,
  dateRange,
  onDateRangeChange,
  onSubmit,
}: {
  dashboard: AdminDashboard
  dateRange: { from: string; to: string }
  onDateRangeChange: (value: { from: string; to: string }) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <section className="page-stack">
      <form className="section-block dashboard-filter" onSubmit={onSubmit}>
        <div>
          <p className="eyebrow">Vaqt oraligʻi</p>
          <h2>Dashboard statistikasi</h2>
        </div>
        <label>
          <span>From</span>
          <input
            type="date"
            value={dateRange.from}
            onChange={(event) => onDateRangeChange({ ...dateRange, from: event.target.value })}
          />
        </label>
        <label>
          <span>To</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(event) => onDateRangeChange({ ...dateRange, to: event.target.value })}
          />
        </label>
        <button className="primary-button" type="submit">
          Yangilash
        </button>
      </form>

      <div className="metric-grid">
        <MetricCard label="Jami kitoblar" value={dashboard.totalBooks} />
        <MetricCard label="Jami foydalanuvchilar" value={dashboard.totalUsers} />
        <MetricCard label="Jami ratinglar" value={dashboard.totalRatings} />
        <MetricCard label="Oraliqda qoʻshilgan kitoblar" value={dashboard.booksAddedInRange} />
        <MetricCard label="Oraliqda qoʻshilgan ratinglar" value={dashboard.ratingsAddedInRange} />
        <MetricCard label="Oraliqdagi oʻrtacha rating" value={dashboard.averageRatingInRange.toFixed(2)} />
      </div>

      <RatingsTable title="Tanlangan oraliqdagi soʻnggi ratinglar" ratings={dashboard.recentRatings} />
    </section>
  )
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function RatingsTable({
  ratings,
  title = 'Book rates jadvali',
}: {
  ratings: AdminBookRating[]
  title?: string
}) {
  return (
    <section className="section-block table-panel">
      <h2>{title}</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Kitob</th>
              <th>Foydalanuvchi</th>
              <th>Reyting</th>
              <th>Izoh</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((rating) => (
              <tr key={rating.id}>
                <td>{rating.bookTitle}</td>
                <td>
                  <div className="rating-user">
                    <UserAvatar username={rating.username} profilePictureUrl={rating.userProfilePictureUrl} />
                    <span>{rating.username}</span>
                  </div>
                </td>
                <td>{rating.value} / 5</td>
                <td>{rating.comment ?? '-'}</td>
                <td>{new Date(rating.createdAt).toLocaleDateString('uz-UZ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function getDefaultDateRange(): { from: string; to: string } {
  const today = new Date()
  const from = new Date(today)
  from.setDate(today.getDate() - 30)

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(today),
  }
}

function toDateInputValue(value: Date): string {
  return value.toISOString().slice(0, 10)
}

function UsersTable({ users }: { users: AdminUser[] }) {
  return (
    <section className="section-block table-panel">
      <h2>Foydalanuvchilar jadvali</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Login</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Reytinglar</th>
              <th>Yaratilgan sana</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="rating-user">
                    <UserAvatar username={item.username} profilePictureUrl={item.profilePictureUrl} />
                    <span>{item.username}</span>
                  </div>
                </td>
                <td>{item.email}</td>
                <td>{item.isAdmin ? 'Admin' : 'Foydalanuvchi'}</td>
                <td>{item.ratingsCount}</td>
                <td>{new Date(item.createdAt).toLocaleDateString('uz-UZ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
