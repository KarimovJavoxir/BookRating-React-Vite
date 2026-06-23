import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorState } from '../components/common/ErrorState'
import { useAuth } from '../context/useAuth'
import { login } from '../services/authService'

export function LoginPage() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const session = await login({ username, password })
      setSession(session)
      navigate(session.user.isAdmin ? '/admin' : '/books')
    } catch {
      setError('Login yoki parol notoʻgʻri.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-panel">
      <div>
        <p className="eyebrow">Foydalanuvchi</p>
        <h1>Tizimga kirish</h1>
        <p>Kitoblarni baholash va admin imkoniyatlaridan foydalanish uchun kiring.</p>
      </div>

      {error ? <ErrorState message={error} /> : null}

      <form className="stack-form" onSubmit={handleSubmit}>
        <label>
          <span>Login</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} required />
        </label>
        <label>
          <span>Parol</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>

      <p className="muted-line">
        Akkaunt yoʻqmi? <Link className="text-link" to="/register">Roʻyxatdan oʻtish</Link>
      </p>
    </section>
  )
}
