import api from './api'

const watchlistService = {
  getWatchlist: async () => {
    const { data } = await api.get('/watchlist')
    return data
  },

  addToWatchlist: async (movieId) => {
    const { data } = await api.post('/watchlist/', { movieId })
    return data
  },

  removeFromWatchlist: async (movieId) => {
    const { data } = await api.delete(`/watchlist/${movieId}`)
    return data
  },

  // e.g. toggling a "watched" flag or updating a personal rating/status
  updateWatchlistEntry: async (movieId, payload) => {
    const { data } = await api.put(`/watchlist/${movieId}`, payload)
    return data
  },
}

export default watchlistService
