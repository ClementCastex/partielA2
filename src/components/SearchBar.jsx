import { useEffect, useMemo, useState } from 'react'
import { fetchGenres } from '../api/tmdb.js'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [year, setYear] = useState('')
  const [sort, setSort] = useState('popularity.desc')
  const [genres, setGenres] = useState([])

  useEffect(() => {
    fetchGenres().then(setGenres).catch(() => setGenres([]))
  }, [])

  const years = useMemo(() => {
    const current = new Date().getFullYear()
    const arr = []
    for (let y = current; y >= 1950; y--) arr.push(String(y))
    return arr
  }, [])

  function submit(e) {
    e.preventDefault()
    onSearch?.({ query, genre, year, sort, page: 1 })
  }

  return (
    <div className="w-full">
      <form onSubmit={submit} className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un film, une série, un artiste..."
          className="w-full rounded-full border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 pl-5 pr-28 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          aria-label="Rechercher"
        />
        <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-indigo-600 px-5 py-2 text-white shadow hover:bg-indigo-700">
          Recherche
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="rounded-full border border-slate-700 bg-slate-800 text-slate-100 px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none" aria-label="Genre">
          <option value="">Tous genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-full border border-slate-700 bg-slate-800 text-slate-100 px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none" aria-label="Année">
          <option value="">Année</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-slate-700 bg-slate-800 text-slate-100 px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none" aria-label="Tri">
          <option value="popularity.desc">Popularité ↓</option>
          <option value="vote_average.desc">Note ↓</option>
          <option value="primary_release_date.desc">Date sortie ↓</option>
        </select>
      </div>
    </div>
  )
}
