import { NavLink, Outlet } from 'react-router-dom'

export function AppLayout() {
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
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <span>Frontend mock maʼlumotlar bilan ishlamoqda.</span>
        <span>Backend keyingi bosqichda ulanadi.</span>
      </footer>
    </div>
  )
}
