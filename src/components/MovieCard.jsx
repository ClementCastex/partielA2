import { Link } from 'react-router-dom'

export default function MovieCard({ movie, genreMap = {} }) {
  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.svg'
  const genres = (movie.genre_ids || []).map((id) => genreMap[id]).filter(Boolean).slice(0, 2)
  return (
    <Link to={`/movie/${movie.id}`} className="group block rounded-xl border border-slate-800 bg-slate-900/80 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="relative aspect-[2/3] bg-slate-800">
        <img src={poster} alt={movie.title} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-yellow-300 font-medium" aria-hidden>
          ★ {movie.vote_average?.toFixed?.(1) ?? '—'}
        </div>
      </div>
      <div className="p-3">
        <div className="font-semibold text-slate-100 group-hover:text-indigo-400 line-clamp-2 min-h-[2.6em]">{movie.title}</div>
        {genres.length > 0 && (
          <div className="mt-1 text-xs text-slate-400 line-clamp-1">{genres.join(' • ')}</div>
        )}
      </div>
    </Link>
  )
}
