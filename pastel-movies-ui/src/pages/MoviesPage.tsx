import { useEffect, useState } from 'react'
import { fetchAllActorsForSelect } from '../api/actorsApi'
import { fetchAllGenresForSelect } from '../api/genresApi'
import {
  createMovie,
  deleteMovie,
  fetchMoviesPage,
  updateMovie,
} from '../api/moviesApi'
import { PaginationBar } from '../components/PaginationBar'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { getErrorMessage } from '../lib/httpError'
import type { Actor, Genre, Movie, SpringPage } from '../types'

export function MoviesPage() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 350)
  const [genreFilter, setGenreFilter] = useState<string>('')
  const [yearFilter, setYearFilter] = useState<string>('')
  const [sort, setSort] = useState('title,asc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SpringPage<Movie> | null>(null)
  const [filterGenres, setFilterGenres] = useState<Genre[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Movie | null>(null)
  const [formGenres, setFormGenres] = useState<Genre[]>([])
  const [formActors, setFormActors] = useState<Actor[]>([])
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [duration, setDuration] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [selectedGenreIds, setSelectedGenreIds] = useState<Set<number>>(new Set())
  const [selectedActorIds, setSelectedActorIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const g = await fetchAllGenresForSelect()
        if (!cancelled) setFilterGenres(g)
      } catch {
        /* ignore filter load errors */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, size, sort, genreFilter, yearFilter])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const genreId = genreFilter ? Number(genreFilter) : undefined
        const yearNum = yearFilter.trim() === '' ? undefined : Number(yearFilter)
        const res = await fetchMoviesPage({
          page,
          size,
          search: debouncedSearch.trim() || undefined,
          genreId: genreId && !Number.isNaN(genreId) ? genreId : undefined,
          year: yearNum !== undefined && !Number.isNaN(yearNum) ? yearNum : undefined,
          sort,
        })
        if (!cancelled) setData(res)
      } catch (e) {
        if (!cancelled) setError(getErrorMessage(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [page, size, debouncedSearch, sort, genreFilter, yearFilter])

  const refresh = async () => {
    const genreId = genreFilter ? Number(genreFilter) : undefined
    const yearNum = yearFilter.trim() === '' ? undefined : Number(yearFilter)
    const res = await fetchMoviesPage({
      page,
      size,
      search: debouncedSearch.trim() || undefined,
      genreId: genreId && !Number.isNaN(genreId) ? genreId : undefined,
      year: yearNum !== undefined && !Number.isNaN(yearNum) ? yearNum : undefined,
      sort,
    })
    setData(res)
  }

  const openCreate = async () => {
    setEditing(null)
    setTitle('')
    setYear('')
    setDuration('')
    setSynopsis('')
    setSelectedGenreIds(new Set())
    setSelectedActorIds(new Set())
    try {
      const [g, a] = await Promise.all([fetchAllGenresForSelect(), fetchAllActorsForSelect()])
      setFormGenres(g)
      setFormActors(a)
      setModalOpen(true)
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  const openEdit = async (m: Movie) => {
    setEditing(m)
    setTitle(m.title)
    setYear(String(m.year))
    setDuration(String(m.duration))
    setSynopsis(m.synopsis ?? '')
    setSelectedGenreIds(new Set(m.genres.map((x) => x.id)))
    setSelectedActorIds(new Set(m.actors.map((x) => x.id)))
    try {
      const [g, a] = await Promise.all([fetchAllGenresForSelect(), fetchAllActorsForSelect()])
      setFormGenres(g)
      setFormActors(a)
      setModalOpen(true)
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  const toggleGenre = (id: number) => {
    setSelectedGenreIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleActor = (id: number) => {
    setSelectedActorIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const save = async () => {
    const y = Number(year)
    const d = Number(duration)
    if (!title.trim() || Number.isNaN(y) || Number.isNaN(d)) return
    try {
      setError(null)
      const body = {
        title: title.trim(),
        year: y,
        duration: d,
        synopsis: synopsis.trim() || null,
        genreIds: [...selectedGenreIds],
        actorIds: [...selectedActorIds],
      }
      if (editing) await updateMovie(editing.id, body)
      else await createMovie(body)
      setModalOpen(false)
      await refresh()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  const remove = async (id: number) => {
    if (!window.confirm('Delete this movie?')) return
    try {
      setError(null)
      await deleteMovie(id)
      await refresh()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Movies</h2>
          <p className="text-sm text-ink-muted">Search, filter, sort, and manage movies</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-pastel-yellow px-4 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-pastel-yellow-deep/40 hover:bg-pastel-yellow-deep/40"
        >
          Add movie
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm text-ink-muted lg:col-span-2">
          Search
          <input
            className="rounded-xl border border-pastel-purple-deep/35 bg-white px-3 py-2 text-ink shadow-inner"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Title or synopsis…"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Genre
          <select
            className="rounded-xl border border-pastel-purple-deep/35 bg-white px-3 py-2 text-ink"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">All genres</option>
            {filterGenres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Year
          <input
            type="number"
            className="rounded-xl border border-pastel-purple-deep/35 bg-white px-3 py-2 text-ink"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            placeholder="e.g. 1999"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-muted sm:col-span-2">
          Sort
          <select
            className="rounded-xl border border-pastel-purple-deep/35 bg-white px-3 py-2 text-ink"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="title,asc">Title A–Z</option>
            <option value="title,desc">Title Z–A</option>
            <option value="year,asc">Year ascending</option>
            <option value="year,desc">Year descending</option>
            <option value="duration,asc">Duration ascending</option>
            <option value="duration,desc">Duration descending</option>
            <option value="id,asc">ID ascending</option>
            <option value="id,desc">ID descending</option>
          </select>
        </label>
      </div>

      {error ? (
        <div className="rounded-xl bg-pastel-pink/80 px-4 py-3 text-sm text-ink ring-1 ring-pastel-pink-deep/40">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl ring-1 ring-pastel-purple-deep/20">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-pastel-purple/50 text-ink">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Year</th>
              <th className="px-4 py-3 font-semibold">Min</th>
              <th className="px-4 py-3 font-semibold">Genres</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  Loading…
                </td>
              </tr>
            ) : data?.empty ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  No movies found
                </td>
              </tr>
            ) : (
              data?.content.map((m) => (
                <tr key={m.id} className="border-t border-pastel-purple-deep/15 odd:bg-white/70">
                  <td className="px-4 py-3 font-medium text-ink">{m.title}</td>
                  <td className="px-4 py-3 text-ink-muted">{m.year}</td>
                  <td className="px-4 py-3 text-ink-muted">{m.duration}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {m.genres.map((g) => (
                        <span
                          key={g.id}
                          className="rounded-full bg-pastel-blue/60 px-2 py-0.5 text-xs text-ink"
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="mr-2 rounded-lg bg-pastel-blue/80 px-2 py-1 text-xs font-medium text-ink hover:bg-pastel-blue"
                      onClick={() => openEdit(m)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-pastel-pink/90 px-2 py-1 text-xs font-medium text-ink hover:bg-pastel-pink-deep/50"
                      onClick={() => remove(m.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && !loading ? (
        <PaginationBar
          page={data.number}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          size={data.size}
          onPageChange={setPage}
          onSizeChange={(s) => {
            setSize(s)
            setPage(0)
          }}
        />
      ) : null}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ring-1 ring-pastel-purple-deep/25">
            <h3 className="text-lg font-semibold text-ink">
              {editing ? 'Edit movie' : 'New movie'}
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-ink-muted sm:col-span-2">
                Title
                <input
                  className="rounded-xl border border-pastel-purple-deep/35 px-3 py-2 text-ink"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink-muted">
                Year
                <input
                  type="number"
                  className="rounded-xl border border-pastel-purple-deep/35 px-3 py-2 text-ink"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink-muted">
                Duration (min)
                <input
                  type="number"
                  className="rounded-xl border border-pastel-purple-deep/35 px-3 py-2 text-ink"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-ink-muted sm:col-span-2">
                Synopsis
                <textarea
                  rows={3}
                  className="rounded-xl border border-pastel-purple-deep/35 px-3 py-2 text-ink"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                />
              </label>
            </div>
            <p className="mt-4 text-sm font-medium text-ink">Genres</p>
            <div className="mt-2 max-h-32 space-y-1 overflow-y-auto rounded-xl bg-pastel-purple/20 p-3">
              {formGenres.map((g) => (
                <label key={g.id} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={selectedGenreIds.has(g.id)}
                    onChange={() => toggleGenre(g.id)}
                  />
                  {g.name}
                </label>
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-ink">Actors</p>
            <div className="mt-2 max-h-32 space-y-1 overflow-y-auto rounded-xl bg-pastel-blue/30 p-3">
              {formActors.map((a) => (
                <label key={a.id} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={selectedActorIds.has(a.id)}
                    onChange={() => toggleActor(a.id)}
                  />
                  {a.name}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm text-ink-muted hover:bg-pastel-purple/30"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!title.trim() || year === '' || duration === ''}
                className="rounded-xl bg-pastel-purple px-4 py-2 text-sm font-semibold text-ink shadow-sm enabled:hover:bg-pastel-purple-deep/50 disabled:opacity-40"
                onClick={save}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
