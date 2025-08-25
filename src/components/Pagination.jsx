// TODO: Implémenter la pagination
// - Boutons Précédent / Suivant
// - Afficher la page courante

export default function Pagination({ page, totalPages, onPrev, onNext, onGoto }) {
  const pages = getPageWindow(page, totalPages)
  return (
    <nav className="mt-8 flex items-center justify-center" role="navigation" aria-label="Pagination">
      <ul className="inline-flex items-center gap-1">
        <li>
          <button onClick={onPrev} disabled={page <= 1} className="h-10 w-10 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50" aria-label="Page précédente">←</button>
        </li>
        {pages.map((p) => (
          <li key={p}>
            <button onClick={() => onGoto?.(p)} className={`h-10 min-w-[2.5rem] rounded-lg border ${p === page ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'}`}>{p}</button>
          </li>
        ))}
        <li>
          <button onClick={onNext} disabled={page >= totalPages} className="h-10 w-10 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50" aria-label="Page suivante">→</button>
        </li>
      </ul>
    </nav>
  )
}

function getPageWindow(page, total) {
  const size = 7
  const half = Math.floor(size / 2)
  let start = Math.max(1, page - half)
  let end = Math.min(total, start + size - 1)
  start = Math.max(1, Math.min(start, end - size + 1))
  const arr = []
  for (let p = start; p <= end; p++) arr.push(p)
  return arr
}
