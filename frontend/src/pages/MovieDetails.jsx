import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import movieService from '../services/movieService'
import watchlistService from '../services/watchlistService'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from '../components/Loader.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'

export default function MovieDetails() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [inWatchlist, setInWatchlist] = useState(false)
  const [watchlistBusy, setWatchlistBusy] = useState(false)
  const [watchlistError, setWatchlistError] = useState(null)

  const fetchMovie = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await movieService.getMovieById(id)
      setMovie(data.data?.movie ?? data.movie ?? null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovie()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!isAuthenticated) return
    ;(async () => {
      try {
        const data = await watchlistService.getWatchlist()
        const items = data.data?.watchlist ?? data.watchlist ?? []
        setInWatchlist(items.some((item) => item.movieId === id))
      } catch {
        // Non-fatal — button just defaults to "Add to Watchlist".
      }
    })()
  }, [isAuthenticated, id])

  const handleToggleWatchlist = async () => {
    setWatchlistError(null)
    setWatchlistBusy(true)
    try {
      if (inWatchlist) {
        await watchlistService.removeFromWatchlist(id)
        setInWatchlist(false)
      } else {
        await watchlistService.addToWatchlist(id)
        setInWatchlist(true)
      }
    } catch (err) {
      setWatchlistError(err.message)
    } finally {
      setWatchlistBusy(false)
    }
  }

  if (loading) return <Loader label="Fetching movie details…" />

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <ErrorBanner message={error} onRetry={fetchMovie} />
        <Link to="/" className="mt-6 inline-block text-sm text-gold hover:text-gold-bright">
          ← Back to browse
        </Link>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="font-display text-xl text-ink">Movie not found</p>
        <Link to="/" className="mt-4 inline-block text-sm text-gold hover:text-gold-bright">
          ← Back to browse
        </Link>
      </div>
    )
  }

  const poster = movie.posterUrl

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/" className="stat-mono mb-6 inline-flex items-center gap-1 text-ink-muted hover:text-gold">
        ← Back to browse
      </Link>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[280px_1fr]">
        <div className="ticket-card">
          <div className="aspect-[2/3] w-full overflow-hidden bg-marquee-raised">
            {poster ? (
              <img src={poster} alt={`${movie.title} poster`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-lg text-ink-faint">{movie.title}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          {movie.genres?.length > 0 && (
            <p className="stat-mono mb-2 text-gold-dim">{movie.genres.join(' · ')}</p>
          )}
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{movie.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
            {movie.releaseYear && <span>{movie.releaseYear}</span>}
            {movie.runtime && <span>{movie.runtime} min</span>}
          </div>

          {movie.overview && (
            <p className="mt-6 max-w-2xl leading-relaxed text-ink-muted">{movie.overview}</p>
          )}

          <div className="mt-8">
            {watchlistError && (
              <div className="mb-3">
                <ErrorBanner message={watchlistError} />
              </div>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleToggleWatchlist}
                disabled={watchlistBusy}
                className={`rounded-md border px-5 py-2.5 font-semibold transition-colors disabled:opacity-60 ${
                  inWatchlist
                    ? 'border-velvet text-velvet-bright hover:bg-velvet/10'
                    : 'border-gold bg-gold text-marquee-bg hover:bg-gold-bright'
                }`}
              >
                {watchlistBusy ? 'Please wait…' : inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-block rounded-md bg-gold px-5 py-2.5 font-semibold text-marquee-bg hover:bg-gold-bright"
              >
                Log in to add to Watchlist
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
