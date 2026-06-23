import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorState } from '../components/common/ErrorState'
import { useAuth } from '../context/useAuth'
import { register } from '../services/authService'

export function RegisterPage() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const session = await register({ username, email, password })
      setSession(session)
      navigate('/books')
    } catch {
      setError('Roʻyxatdan oʻtishda xatolik yuz berdi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-panel">
      <div>
        <p className="eyebrow">Yangi akkaunt</p>
        <h1>Roʻyxatdan oʻtish</h1>
        <p>Yangi foydalanuvchi akkaunti yaratib, kitoblarga reyting qoldiring.</p>
      </div>

      {error ? <ErrorState message={error} /> : null}

      <form className="stack-form" onSubmit={handleSubmit}>
        <label>
          <span>Login</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} required />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          <span>Parol</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
        </label>
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Yaratilmoqda...' : 'Roʻyxatdan oʻtish'}
        </button>
      </form>

      <p className="muted-line">
        Akkaunt bormi? <Link className="text-link" to="/login">Kirish</Link>
      </p>
    </section>
  )
}
