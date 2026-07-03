import api from './api'

const movieService = {
  // params can include { search, genre, minRating, page } — the service
  // stays a thin pass-through so it matches whatever query params your
  // Express route actually supports.
  getMovies: async (params = {}) => {
    const { data } = await api.get('/movies', { params })
    return data
  },

  getMovieById: async (id) => {
    const { data } = await api.get(`/movies/${id}`)
    return data
  },
}

export default movieService
