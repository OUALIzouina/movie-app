import axios from 'axios'

// Central Axios instance. `withCredentials: true` is what lets the browser
// send/receive the HTTP-only JWT cookie set by the Express backend — this
// must be true on every request that talks to a protected endpoint.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Normalize error shape so components can rely on `error.message` regardless
// of whether the failure came from the network or the API's JSON body.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.'
    return Promise.reject({ ...error, message, status: error.response?.status })
  }
)

export default api
