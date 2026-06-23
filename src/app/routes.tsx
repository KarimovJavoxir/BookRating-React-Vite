import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { AdminPage } from '../pages/AdminPage'
import { BookDetailsPage } from '../pages/BookDetailsPage'
import { BooksPage } from '../pages/BooksPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { EmptyState } from '../components/common/EmptyState'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route
          path="*"
          element={
            <EmptyState
              title="Sahifa topilmadi"
              description="Kiritilgan manzil uchun frontend route mavjud emas."
            />
          }
        />
      </Route>
    </Routes>
  )
}
