import { useEffect, useMemo, useState, useCallback } from 'react'
import movieService from '../services/movieService'
import watchlistService from '../services/watchlistService'
import { useAuth } from '../context/AuthContext.jsx'
import MovieCard from '../components/MovieCard.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'

const GENRE_OPTIONS = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Romance', 'Documentary']

export default function Home() {
  const { isAuthenticated } = useAuth()

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All')

  const [watchlistIds, setWatchlistIds] = useState(new Set())

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (search.trim()) params.search = search.trim()
      if (genre !== 'All') params.genre = genre

      const data = await movieService.getMovies(params)
      // Backend wraps responses as { status, data: { movies: [...] } };
      // fall back to a bare array in case a route returns one directly.
      setMovies(data.data?.movies ?? data.movies ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, genre])

  // Debounce search input so we don't hit the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(fetchMovies, 350)
    return () => clearTimeout(timer)
  }, [fetchMovies])

  // Load the user's watchlist once (when logged in) so cards can render
  // "Remove" vs "Add" correctly without a per-card network call.
  useEffect(() => {
    if (!isAuthenticated) {
      setWatchlistIds(new Set())
      return
    }
    ;(async () => {
      try {
        const data = await watchlistService.getWatchlist()
        const items = data.data?.watchlist ?? data.watchlist ?? []
        setWatchlistIds(new Set(items.map((item) => item.movieId)))
      } catch {
        // Non-fatal — cards just fall back to "Add to Watchlist" for everything.
      }
    })()
  }, [isAuthenticated])

  const handleToggleWatchlist = async (movie) => {
    const isIn = watchlistIds.has(movie.id)
    try {
      if (isIn) {
        await watchlistService.removeFromWatchlist(movie.id)
        setWatchlistIds((prev) => {
          const next = new Set(prev)
          next.delete(movie.id)
          return next
        })
      } else {
        await watchlistService.addToWatchlist(movie.id)
        setWatchlistIds((prev) => new Set(prev).add(movie.id))
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const emptyState = useMemo(
    () => !loading && !error && movies.length === 0,
    [loading, error, movies]
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="stat-mono mb-2 text-gold-dim">Box office · tonight</p>
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Browse the reel</h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Search the catalog, filter by genre or rating, and build a watchlist for later.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies by title…"
          className="w-full rounded-md border border-marquee-line bg-marquee-raised px-4 py-2.5 text-ink placeholder:text-ink-faint focus:border-gold"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-md border border-marquee-line bg-marquee-raised px-3 py-2.5 text-ink sm:w-48"
        >
          {GENRE_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="mb-6"><ErrorBanner message={error} onRetry={fetchMovies} /></div>}

      {loading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : emptyState ? (
        <div className="rounded-md border border-marquee-line bg-marquee-raised px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">No movies match that search</p>
          <p className="mt-2 text-sm text-ink-muted">Try a different title, genre, or rating filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              inWatchlist={watchlistIds.has(movie.id)}
              onToggleWatchlist={handleToggleWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  )
}
