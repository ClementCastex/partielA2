# partielA2 — Catalogue de films (React + Vite + Tailwind + TMDb)

Application front permettant de rechercher, filtrer et consulter des fiches de films (synopsis, casting, bande‑annonce, avis). Construite avec React 18, Vite 5 et Tailwind CSS. Les données proviennent de l'API TMDb.

## Prérequis
- Node.js 18.x (ou supérieur compatible avec Vite 5)
- Une clé API TMDb (v3) et/ou un jeton (v4) Read Access

## Démarrage rapide

```bash
npm install
# Variables d'environnement (voir ci‑dessous)
npm run dev
```

- Local: http://localhost:5173

## Variables d’environnement
Créer un fichier `.env` à la racine et renseigner au moins une des variables ci‑dessous:

```
VITE_TMDB_API_KEY=...        # Clé v3 (facultatif si vous utilisez le jeton v4)
VITE_TMDB_READ_TOKEN=...     # Jeton v4 Read Access (recommandé)
```

Un `.env.exemple` est fourni (vide). Le fichier `.env` est ignoré par Git.

## Scripts NPM
- `npm run dev` — lance le serveur de développement Vite
- `npm run build` — construit l’application pour la production
- `npm run preview` — prévisualise le build localement

## Fonctionnalités
- Recherche par mot‑clé (TMDb Search)
- Filtres: genre, année, tri (popularité, note, date)
- Grille responsive (1 → 5 colonnes selon la largeur)
- Pagination personnalisée: 10 films par page (mapping des pages TMDb 20→10)
- Cartes films: affiche, titre, genres, note, (année via la date de sortie)
- Détails d’un film: backdrop, affiche, genres, durée, date, note, synopsis complet
- Casting principal (têtes d’affiche)
- Bande‑annonce YouTube si disponible
- Avis des spectateurs (TMDb Reviews) avec pagination
- Thème sombre moderne (Tailwind)

## Structure du projet
```
src/
  api/
    tmdb.js                 # Fonctions d’accès TMDb (search, discover, details, credits, reviews, etc.)
  components/
    Header.jsx              # En‑tête + hero
    SearchBar.jsx           # Barre de recherche + filtres
    MovieCard.jsx           # Carte film
    Pagination.jsx          # Pagination numérotée
  pages/
    Home.jsx                # Catalogue + grille + pagination (10/pg)
    MovieDetails.jsx        # Page détails: synopsis, casting, trailer, avis
  styles/
    globals.css             # Tailwind directives et utilitaires
public/
  placeholder-poster.svg
```

## Pile technique
- React 18 + Vite 5
- React Router v6
- Tailwind CSS 3 + PostCSS + Autoprefixer
- API TMDb (v3/v4)

## Notes d’implémentation
- Auth TMDb: priorité au jeton v4 (Authorization: Bearer). À défaut, `api_key` v3 est ajoutée à l’URL.
- Pagination 10/pg: chaque page TMDb (20 résultats) est découpée en 2 pages UI; le total est recalculé à partir de `total_results`.
- Gestion d’état: affichage des états `Chargement…` et messages d’erreur.

## Dépannage
- "You are using Node.js 18.x…": Vite 5 fonctionne avec Node 18.x. Si vous utilisez une autre version, mettez à jour Node ou ajustez les versions de Vite.
- Aucune donnée ne s’affiche: vérifiez `.env` (clé/jeton TMDb) et rechargez (Ctrl+F5). Consultez l’onglet Réseau du navigateur.
- CORS/403: votre clé/jeton peut être erroné ou expiré; régénérez depuis votre compte TMDb.

## Licence
Ce projet est un livrable d’évaluation pédagogique. Marques et contenus TMDb © leurs propriétaires respectifs.
