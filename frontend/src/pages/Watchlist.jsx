import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import watchlistService from '../services/watchlistService'
import SkeletonCard from '../components/SkeletonCard.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'

export default function Watchlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  const fetchWatchlist = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await watchlistService.getWatchlist()
      setItems(data.data?.watchlist ?? data.watchlist ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const handleRemove = async (movieId) => {
    setRemovingId(movieId)
    try {
      await watchlistService.removeFromWatchlist(movieId)
      setItems((prev) => prev.filter((item) => item.movieId !== movieId))
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="stat-mono mb-2 text-gold-dim">Your reservations</p>
      <h1 className="mb-8 font-display text-4xl font-bold text-ink">My Watchlist</h1>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onRetry={fetchWatchlist} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-md border border-marquee-line bg-marquee-raised px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">Your watchlist is empty</p>
          <p className="mt-2 text-sm text-ink-muted">Browse the catalog and add a few titles for later.</p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-md bg-gold px-5 py-2.5 font-semibold text-marquee-bg hover:bg-gold-bright"
          >
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const movie = item.movie
            const movieId = item.movieId
            const poster = movie.posterUrl

            return (
              <div key={movieId} className="ticket-card">
                <Link to={`/movies/${movieId}`} className="block">
                  <div className="aspect-[2/3] w-full overflow-hidden bg-marquee-raised">
                    {poster ? (
                      <img src={poster} alt={`${movie.title} poster`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-display text-lg text-ink-faint">{movie.title}</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="ticket-perf" />
                <div className="flex flex-col gap-2 p-4">
                  <h3 className="line-clamp-1 font-display text-lg font-semibold text-ink">{movie.title}</h3>
                  <button
                    onClick={() => handleRemove(movieId)}
                    disabled={removingId === movieId}
                    className="mt-2 rounded-md border border-velvet px-3 py-1.5 text-sm font-medium text-velvet-bright transition-colors hover:bg-velvet/10 disabled:opacity-50"
                  >
                    {removingId === movieId ? 'Removing…' : 'Remove from Watchlist'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
