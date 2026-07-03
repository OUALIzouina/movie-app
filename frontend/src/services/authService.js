import api from './api'

// Adjust the `/auth/me` path if your backend exposes session-check
// differently (e.g. `/auth/profile`). It's used on app load to silently
// verify the HTTP-only cookie is still valid.
const authService = {
  register: async ({ name, email, password }) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    return data
  },

  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout')
    return data
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },
}

export default authService
