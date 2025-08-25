import { Link } from 'react-router-dom'
import Logo from '../assets/Logo Icon Off V2.svg'

export default function Header({ children }) {
  return (
    <header className="relative bg-gradient-to-b from-slate-900/90 to-slate-900 border-b border-slate-800">
      <div className="container-page py-10">
        <div className="flex items-center justify-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 font-semibold text-slate-100">
            <img src={Logo} alt="Logo" className="h-9 w-9" />
            <span className="text-xl">catalogue film</span>
          </Link>
        </div>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Bienvenue,</h1>
          <p className="mt-2 text-slate-300">Des millions de films, d'émissions TV et d'artistes...</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </header>
  )
}
