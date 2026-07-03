import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * A ticket-stub styled movie card. `inWatchlist` + `onToggleWatchlist` are
 * optional — pass them from a parent that knows the user's watchlist state
 * (Home.jsx does this) so the button can show Add / Remove correctly.
 */
export default function MovieCard({ movie, inWatchlist = false, onToggleWatchlist }) {
  const { isAuthenticated } = useAuth()
  const [busy, setBusy] = useState(false)

  const poster = movie.posterUrl

  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!onToggleWatchlist || busy) return
    setBusy(true)
    try {
      await onToggleWatchlist(movie)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Link to={`/movies/${movie.id}`} className="group block">
      <div className="ticket-card transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-glow">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-marquee-raised">
          {poster ? (
            <img
              src={poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-lg text-ink-faint">{movie.title}</span>
            </div>
          )}

          {movie.releaseYear && (
            <span className="absolute right-2 top-2 rounded-full bg-marquee-bg/85 px-2 py-1 font-mono text-xs font-bold text-gold shadow-glow">
              {movie.releaseYear}
            </span>
          )}
        </div>

        <div className="ticket-perf" />

        <div className="flex flex-col gap-2 p-4">
          <h3 className="line-clamp-1 font-display text-lg font-semibold text-ink">{movie.title}</h3>
          {movie.genres?.length > 0 && (
            <p className="stat-mono text-gold-dim">{movie.genres.join(' · ')}</p>
          )}
          {movie.overview && (
            <p className="line-clamp-2 text-sm text-ink-muted">{movie.overview}</p>
          )}

          {isAuthenticated && onToggleWatchlist && (
            <button
              onClick={handleToggle}
              disabled={busy}
              className={`mt-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                inWatchlist
                  ? 'border-velvet text-velvet-bright hover:bg-velvet/10'
                  : 'border-gold-dim text-gold hover:bg-gold/10'
              }`}
            >
              {busy ? 'Please wait…' : inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
