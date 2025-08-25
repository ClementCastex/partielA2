// src/api/tmdb.js
// Implémentation minimale des appels TMDb.
// Utilise en priorité le jeton (v4) `VITE_TMDB_READ_TOKEN`,
// sinon la clé (v3) `VITE_TMDB_API_KEY` via le paramètre `api_key`.

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3'

function getAuthHeaders() {
  const v4Token = import.meta.env.VITE_TMDB_READ_TOKEN
  if (v4Token) {
    return { Authorization: `Bearer ${v4Token}` }
  }
  return {}
}

function withApiKey(url) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  if (!apiKey) return url
  const hasQuery = url.includes('?')
  const join = hasQuery ? '&' : '?'
  return `${url}${join}api_key=${apiKey}`
}

async function tmdbFetch(path, { query = {} } = {}) {
  const url = new URL(`${TMDB_API_BASE_URL}${path}`)
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  // Si pas de token v4, ajouter api_key v3
  const finalUrl = Object.keys(getAuthHeaders()).length === 0 ? withApiKey(url.toString()) : url.toString()

  const res = await fetch(finalUrl, { headers: { 'Content-Type': 'application/json', ...getAuthHeaders() } })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`TMDb error ${res.status}: ${text}`)
  }
  return res.json()
}

export async function fetchGenres() {
  const data = await tmdbFetch('/genre/movie/list', { query: { language: 'fr-FR' } })
  return data.genres ?? []
}

export async function searchMovies(query, page = 1) {
  if (!query) {
    const data = await tmdbFetch('/discover/movie', { query: { page, language: 'fr-FR', sort_by: 'popularity.desc' } })
    return data
  }
  return tmdbFetch('/search/movie', { query: { query, page, language: 'fr-FR', include_adult: false } })
}

export async function discoverByGenre(genreId, page = 1) {
  const query = { page, language: 'fr-FR', sort_by: 'popularity.desc' }
  if (genreId) query.with_genres = String(genreId)
  return tmdbFetch('/discover/movie', { query })
}

export async function getMovieDetails(movieId) {
  return tmdbFetch(`/movie/${movieId}`, { query: { language: 'fr-FR' } })
}

export async function getMovieReviews(movieId, page = 1) {
  return tmdbFetch(`/movie/${movieId}/reviews`, { query: { page, language: 'fr-FR' } })
}

export async function getMovieCredits(movieId) {
  return tmdbFetch(`/movie/${movieId}/credits`, { query: { language: 'fr-FR' } })
}

export async function getMovieVideos(movieId) {
  return tmdbFetch(`/movie/${movieId}/videos`, { query: { language: 'fr-FR' } })
}

export async function getMovieImages(movieId) {
  return tmdbFetch(`/movie/${movieId}/images`, { query: {} })
} 