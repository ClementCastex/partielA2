# partielA2 — React 18 + Vite + React Router

## Démarrage

```bash
npm install
npm run dev
```

- URL par défaut: `http://localhost:5173`
- Variable d'environnement: créer un fichier `.env` à la racine avec `VITE_TMDB_API_KEY=...` (voir `.env.example`).

## Structure

```
src/
  api/
    tmdb.js
  components/
    Header.jsx
    SearchBar.jsx
    MovieCard.jsx
    Pagination.jsx
  pages/
    Home.jsx
    MovieDetails.jsx
  styles/
    globals.css
public/
  placeholder-poster.svg
```

## Routes
- `/` → `Home`
- `/movie/:id` → `MovieDetails`

## Scripts utiles
- `npm run dev` — démarrer le serveur de développement
- `npm run build` — construire pour la prod
- `npm run preview` — prévisualiser le build
