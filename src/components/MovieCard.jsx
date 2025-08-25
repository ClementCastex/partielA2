// TODO: Implémenter la carte film (MovieCard)
// - Afficher l'affiche, le titre, la note
// - Lier vers la page de détails

export default function MovieCard() {
  return (
    <article>
      <img src="/placeholder-poster.svg" alt="Poster placeholder" width={150} height={225} />
      <h3>Titre du film</h3>
      <p>Note: --</p>
    </article>
  )
}
