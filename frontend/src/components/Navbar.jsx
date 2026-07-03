import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useState } from 'react'

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-1 py-2 text-sm tracking-wide transition-colors ${
          isActive ? 'text-gold' : 'text-ink-muted hover:text-ink'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            className={`absolute -bottom-0.5 left-0 h-1.5 w-1.5 rounded-full bg-gold transition-opacity ${
              isActive ? 'opacity-100 shadow-glow' : 'opacity-0'
            }`}
          />
        </>
      )}
    </NavLink>
  )
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-marquee-line bg-marquee-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-gold">Reel</span>
          <span className="stat-mono hidden sm:inline">now showing</span>
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          <NavItem to="/">Browse</NavItem>
          {isAuthenticated && <NavItem to="/watchlist">Watchlist</NavItem>}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <span className="stat-mono">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-marquee-line px-3 py-1.5 text-sm text-ink transition-colors hover:border-velvet hover:text-velvet-bright"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-3 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-md bg-gold px-3 py-1.5 text-sm font-semibold text-marquee-bg transition-colors hover:bg-gold-bright"
              >
                Sign up
              </NavLink>
            </>
          )}
        </div>

        <button
          className="text-ink md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-marquee-line bg-marquee-bg px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-3">
            <NavItem to="/">Browse</NavItem>
            {isAuthenticated && <NavItem to="/watchlist">Watchlist</NavItem>}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="mt-2 rounded-md border border-marquee-line px-3 py-2 text-left text-sm text-ink"
              >
                Log out ({user?.name || user?.email})
              </button>
            ) : (
              <div className="mt-2 flex gap-3">
                <NavLink to="/login" className="text-sm text-ink-muted" onClick={() => setMenuOpen(false)}>
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-md bg-gold px-3 py-1.5 text-sm font-semibold text-marquee-bg"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
