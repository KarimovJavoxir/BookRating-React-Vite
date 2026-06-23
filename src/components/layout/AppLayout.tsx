import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand-link" to="/" aria-label="Bosh sahifa">
          <span className="brand-mark" aria-hidden="true">
            ARM
          </span>
          <span>
            <strong>Kitob reytingi</strong>
            <small>Axborot resurs markazi</small>
          </span>
        </NavLink>

        <nav className="site-nav" aria-label="Asosiy menyu">
          <NavLink to="/">Bosh sahifa</NavLink>
          <NavLink to="/books">Kitoblar</NavLink>
          {user?.isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
          {!user ? <NavLink to="/login">Kirish</NavLink> : null}
          {!user ? <NavLink to="/register">Roʻyxatdan oʻtish</NavLink> : null}
        </nav>
        {user ? (
          <div className="header-user">
            <span className="avatar avatar--small">{getUserInitial(user.username)}</span>
            <span>{user.username}</span>
            <button className="text-button" type="button" onClick={logout}>
              Chiqish
            </button>
          </div>
        ) : null}
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <span>Frontend ASP.NET Core backend API bilan ishlaydi.</span>
        <span>API manzili VITE_API_BASE_URL orqali sozlanadi.</span>
      </footer>
    </div>
  )
}

function getUserInitial(username: string): string {
  return username.trim().charAt(0).toUpperCase() || 'U'
}
