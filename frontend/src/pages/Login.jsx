import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import ErrorBanner from '../components/ErrorBanner.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = await login(form)
    setSubmitting(false)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <p className="stat-mono mb-2 text-gold-dim">Welcome back</p>
      <h1 className="mb-8 font-display text-3xl font-bold text-ink">Log in to Reel</h1>

      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-muted">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className="rounded-md border border-marquee-line bg-marquee-raised px-3 py-2.5 text-ink focus:border-gold"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-ink-muted">Password</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            className="rounded-md border border-marquee-line bg-marquee-raised px-3 py-2.5 text-ink focus:border-gold"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-gold px-4 py-2.5 font-semibold text-marquee-bg transition-colors hover:bg-gold-bright disabled:opacity-60"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="text-gold hover:text-gold-bright">
          Sign up
        </Link>
      </p>
    </div>
  )
}
