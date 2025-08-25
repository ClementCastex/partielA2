// src/api/tmdb.js
// TODO: Implémenter les appels à l'API TMDb en utilisant la clé d'API depuis import.meta.env.VITE_TMDB_API_KEY

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3'

export async function fetchGenres() {
  // TODO: Récupérer la liste des genres
  throw new Error('fetchGenres not implemented')
}

export async function searchMovies(query, page = 1) {
  // TODO: Rechercher des films par requête
  throw new Error('searchMovies not implemented')
}

export async function discoverByGenre(genreId, page = 1) {
  // TODO: Découvrir des films par genre
  throw new Error('discoverByGenre not implemented')
}

export async function getMovieDetails(movieId) {
  // TODO: Détails d'un film
  throw new Error('getMovieDetails not implemented')
}

export async function getMovieReviews(movieId, page = 1) {
  // TODO: Avis/critiques d'un film
  throw new Error('getMovieReviews not implemented')
} 