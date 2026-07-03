import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from './Loader.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  // Wait for the initial "am I logged in?" cookie check before deciding —
  // otherwise a hard refresh on a protected page would flash-redirect to /login.
  if (initializing) {
    return <Loader label="Checking your session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
