import { Link, NavLink, Outlet } from 'react-router-dom'

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-xl px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-white text-ink shadow-sm ring-1 ring-pastel-purple-deep/30'
      : 'text-ink-muted hover:bg-white/60 hover:text-ink',
  ].join(' ')

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-pastel-pink/30 to-pastel-blue/40 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/movies" className="inline-block">
              <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Pastel Movies
              </h1>
            </Link>
            <p className="mt-1 text-sm text-ink-muted">Soft UI for your film library</p>
          </div>
          <div className="flex flex-wrap gap-2 rounded-2xl bg-white/50 p-2 shadow-sm ring-1 ring-pastel-purple-deep/20 backdrop-blur-sm">
            <NavLink to="/movies" className={navClass}>
              Movies
            </NavLink>
            <NavLink to="/genres" className={navClass}>
              Genres
            </NavLink>
            <NavLink to="/actors" className={navClass}>
              Actors
            </NavLink>
            <NavLink to="/users" className={navClass}>
              Users
            </NavLink>
            <NavLink to="/reviews" className={navClass}>
              Reviews
            </NavLink>
          </div>
        </header>

        <main className="rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-pastel-purple-deep/15 backdrop-blur-md sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
