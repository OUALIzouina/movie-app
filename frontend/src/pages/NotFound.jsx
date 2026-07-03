import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="stat-mono mb-2 text-gold-dim">Reel 404</p>
      <h1 className="font-display text-5xl font-bold text-ink">Scene missing</h1>
      <p className="mt-3 text-ink-muted">This page didn't make the final cut.</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-gold px-5 py-2.5 font-semibold text-marquee-bg hover:bg-gold-bright"
      >
        Back to browse
      </Link>
    </div>
  )
}
