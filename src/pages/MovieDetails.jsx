import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieCredits, getMovieDetails, getMovieImages, getMovieVideos, getMovieReviews } from '../api/tmdb.js'

export default function MovieDetails() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [movie, setMovie] = useState(null)
  const [credits, setCredits] = useState(null)
  const [videos, setVideos] = useState(null)
  const [images, setImages] = useState(null)
  const [reviews, setReviews] = useState({ page: 1, total_pages: 1, results: [] })

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    Promise.all([
      getMovieDetails(id),
      getMovieCredits(id),
      getMovieVideos(id),
      getMovieImages(id),
      getMovieReviews(id, 1),
    ])
      .then(([m, c, v, i, r]) => {
        if (!active) return
        setMovie(m)
        setCredits(c)
        setVideos(v)
        setImages(i)
        setReviews(r || { page: 1, total_pages: 1, results: [] })
      })
      .catch((e) => active && setError(e.message || 'Erreur inconnue'))
      .finally(() => active && setLoading(false))

    return () => { active = false }
  }, [id])

  async function loadReviewPage(nextPage) {
    try {
      const data = await getMovieReviews(id, nextPage)
      setReviews(data)
    } catch (e) {
      // ignorer silencieusement
    }
  }

  const backdrop = useMemo(() => (
    movie?.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : ''
  ), [movie])

  if (loading) return <div className="container-page py-10 text-slate-400">Chargement...</div>
  if (error) return <div className="container-page py-10 text-red-400">{error}</div>
  if (!movie) return null

  const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-poster.svg'
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : ''
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h${String(movie.runtime % 60).padStart(2, '0')}` : ''
  const genres = (movie.genres || []).map((g) => g.name).join(' • ')
  const vote = movie.vote_average ? movie.vote_average.toFixed(1) : '—'

  const cast = (credits?.cast || []).slice(0, 8)
  const trailer = (videos?.results || []).find((v) => v.type === 'Trailer' && v.site === 'YouTube')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative">
        {backdrop && (
          <div className="h-80 w-full bg-cover bg-center" style={{ backgroundImage: `url(${backdrop})` }} aria-hidden />
        )}
        <div className="bg-gradient-to-b from-slate-950/70 to-slate-950">
          <div className="container-page -mt-24 pb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="shrink-0 w-52 md:w-60 -mt-8 md:-mt-16">
                <img src={poster} alt={movie.title} className="w-full rounded-xl border border-slate-800 shadow-lg" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  {movie.title} {year && <span className="text-slate-400 text-2xl">({year})</span>}
                </h1>
                <div className="mt-2 text-sm text-slate-300">
                  <span>{movie.release_date} • {genres} • {runtime}</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 text-sm">
                  <span className="rounded-md bg-black/60 px-2 py-1 text-yellow-300">★ {vote}</span>
                  {movie.original_title && movie.original_title !== movie.title && (
                    <span className="text-slate-400">Titre original: {movie.original_title}</span>
                  )}
                </div>
                {movie.overview && (
                  <div className="mt-6">
                    <h2 className="section-title text-xl">Synopsis</h2>
                    <p className="mt-2 text-slate-300 leading-relaxed">{movie.overview}</p>
                  </div>
                )}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-200">Réalisation / Scénario</h3>
                    <ul className="mt-2 text-sm text-slate-300">
                      {(credits?.crew || [])
                        .filter((p) => ['Director', 'Writer', 'Screenplay'].includes(p.job))
                        .slice(0, 5)
                        .map((p) => (
                          <li key={p.credit_id}>{p.name} — {p.job}</li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">Infos</h3>
                    <ul className="mt-2 text-sm text-slate-300">
                      <li>Statut: {movie.status || 'N/A'}</li>
                      <li>Langue originale: {movie.original_language?.toUpperCase()}</li>
                      {movie.budget ? <li>Budget: ${movie.budget.toLocaleString()}</li> : null}
                      {movie.revenue ? <li>Recette: ${movie.revenue.toLocaleString()}</li> : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {cast.length > 0 && (
              <section className="mt-10">
                <h2 className="section-title">Têtes d'affiche</h2>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {cast.map((person) => (
                    <div key={person.cast_id || person.credit_id} className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                      <div className="aspect-[2/3] bg-slate-800">
                        <img
                          src={person.profile_path ? `https://image.tmdb.org/t/p/w300${person.profile_path}` : '/placeholder-poster.svg'}
                          alt={person.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-sm font-semibold text-slate-100 line-clamp-1">{person.name}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{person.character}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {trailer && (
              <section className="mt-10">
                <h2 className="section-title">Bande-annonce</h2>
                <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-slate-800 bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Bande-annonce"
                    className="h-full w-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            <section className="mt-10">
              <h2 className="section-title">Avis des spectateurs</h2>
              {reviews.results.length === 0 ? (
                <p className="mt-3 text-slate-400">Aucun avis pour le moment.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {reviews.results.slice(0, 5).map((rev) => (
                    <article key={rev.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                      <header className="mb-2 text-sm text-slate-300">
                        <span className="font-semibold text-slate-100">{rev.author}</span>
                        {rev.author_details?.rating != null && (
                          <span className="ml-2 rounded bg-black/50 px-2 py-0.5 text-xs text-yellow-300">★ {rev.author_details.rating}</span>
                        )}
                        <span className="ml-2 text-slate-500">{new Date(rev.created_at).toLocaleDateString()}</span>
                      </header>
                      <p className="text-slate-300 whitespace-pre-line">
                        {rev.content.length > 1000 ? rev.content.slice(0, 1000) + '…' : rev.content}
                      </p>
                    </article>
                  ))}
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => loadReviewPage(Math.max(1, reviews.page - 1))} disabled={reviews.page <= 1} className="h-9 px-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-50">Page précédente</button>
                    <span className="text-sm text-slate-400">Page {reviews.page} / {reviews.total_pages}</span>
                    <button onClick={() => loadReviewPage(Math.min(reviews.total_pages, reviews.page + 1))} disabled={reviews.page >= reviews.total_pages} className="h-9 px-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-50">Page suivante</button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 