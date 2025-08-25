import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header.jsx'
import SearchBar from '../components/SearchBar.jsx'
import MovieCard from '../components/MovieCard.jsx'
import Pagination from '../components/Pagination.jsx'
import { discoverByGenre, fetchGenres, searchMovies } from '../api/tmdb.js'

export default function Home() {
  const [criteria, setCriteria] = useState({ query: '', genre: '', year: '', sort: 'popularity.desc', page: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [genreMap, setGenreMap] = useState({})

  useEffect(() => {
    fetchGenres().then((arr) => {
      const map = Object.fromEntries(arr.map((g) => [g.id, g.name]))
      setGenreMap(map)
    })
  }, [])

  function mapToApiPage(uiPage) {
    return Math.floor((uiPage - 1) / 2) + 1 // TMDb renvoie 20/pg → 2 pages UI de 10
  }
  function sliceUiPage(items, uiPage) {
    const offset = ((uiPage - 1) % 2) * 10
    return (items || []).slice(offset, offset + 10)
  }
  function computeCustomTotalPages(totalResults, fallbackTotalPages20) {
    const total = totalResults ?? (fallbackTotalPages20 ? fallbackTotalPages20 * 20 : 0)
    return Math.max(1, Math.ceil(total / 10))
  }

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    const fetcher = async () => {
      try {
        let data
        const apiPage = mapToApiPage(criteria.page)
        if (criteria.query) {
          data = await searchMovies(criteria.query, apiPage)
        } else {
          const params = new URLSearchParams()
          params.set('page', String(apiPage))
          params.set('language', 'fr-FR')
          params.set('sort_by', criteria.sort)
          if (criteria.genre) params.set('with_genres', criteria.genre)
          if (criteria.year) params.set('primary_release_year', criteria.year)

          const headers = getHeaders()
          const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
          const res = await fetch(url, { headers })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          data = await res.json()
        }
        if (!active) return
        const pageItems = sliceUiPage(data.results || [], criteria.page)
        setResults(pageItems)
        setTotalPages(computeCustomTotalPages(data.total_results, data.total_pages))
      } catch (e) {
        if (!active) return
        setError(e.message || 'Erreur inconnue')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetcher()
    return () => { active = false }
  }, [criteria])

  function onSearch(newCriteria) {
    setCriteria((c) => ({ ...c, ...newCriteria, page: 1 }))
  }

  function getHeaders() {
    const token = import.meta.env.VITE_TMDB_READ_TOKEN
    if (token) return { Authorization: `Bearer ${token}` }
    return {}
  }

  const gridClasses = useMemo(() => 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6', [])

  return (
    <div className="min-h-screen">
      <Header>
        <SearchBar onSearch={onSearch} />
      </Header>

      <main className="container-page py-10">
        <div className="mb-4">
          <h2 className="section-title">Tendances</h2>
          <p className="section-subtitle">Les films populaires du moment</p>
        </div>

        {loading && <p className="text-slate-400">Chargement...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <section aria-label="Catalogue de films" className="mt-4">
          <div className={gridClasses}>
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} genreMap={genreMap} />
            ))}
          </div>
        </section>

        <Pagination
          page={criteria.page}
          totalPages={totalPages}
          onPrev={() => setCriteria((c) => ({ ...c, page: Math.max(1, c.page - 1) }))}
          onNext={() => setCriteria((c) => ({ ...c, page: Math.min(totalPages, c.page + 1) }))}
          onGoto={(p) => setCriteria((c) => ({ ...c, page: p }))}
        />
      </main>
    </div>
  )
} 