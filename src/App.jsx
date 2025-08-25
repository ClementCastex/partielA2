import { Routes, Route } from 'react-router-dom'
import './App.css'
// TODO: Importer Header, SearchBar quand ils seront implémentés
import Home from './pages/Home.jsx'
import MovieDetails from './pages/MovieDetails.jsx'

function App() {
  return (
    <>
      {/* TODO: Ajouter le composant Header ici */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </>
  )
}

export default App
