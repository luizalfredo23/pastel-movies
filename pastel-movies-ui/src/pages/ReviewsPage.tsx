import { useEffect, useState } from 'react'
import { fetchAllMoviesForSelect } from '../api/moviesApi'
import { createReview, deleteReview, fetchReviewsPage, updateReview } from '../api/reviewsApi'
import { fetchAllUsersForSelect } from '../api/usersApi'
import { PaginationBar } from '../components/PaginationBar'
import { getErrorMessage } from '../lib/httpError'
import type { Movie, AppUser, Review, SpringPage } from '../types'

export function ReviewsPage() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [movieFilter, setMovieFilter] = useState<string>('')
  const [userFilter, setUserFilter] = useState<string>('')
  const [sort, setSort] = useState('id,asc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SpringPage<Review> | null>(null)
  const [moviesPick, setMoviesPick] = useState<Movie[]>([])
  const [usersPick, setUsersPick] = useState<AppUser[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Review | null>(null)
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [movieId, setMovieId] = useState<string>('')
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [m, u] = await Promise.all([fetchAllMoviesForSelect(), fetchAllUsersForSelect()])
        if (!cancelled) {
          setMoviesPick(m)
          setUsersPick(u)
        }
      } catch {
        /* ignore */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setPage(0)
  }, [size, sort, movieFilter, userFilter])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const mid = movieFilter ? Number(movieFilter) : undefined
        const uid = userFilter ? Number(userFilter) : undefined
        const res = await fetchReviewsPage({
          page,
          size,
          movieId: mid && !Number.isNaN(mid) ? mid : undefined,
          userId: uid && !Number.isNaN(uid) ? uid : undefined,
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
  }, [page, size, sort, movieFilter, userFilter])

  const refresh = async () => {
    const mid = movieFilter ? Number(movieFilter) : undefined
    const uid = userFilter ? Number(userFilter) : undefined
    const res = await fetchReviewsPage({
      page,
      size,
      movieId: mid && !Number.isNaN(mid) ? mid : undefined,
      userId: uid && !Number.isNaN(uid) ? uid : undefined,
      sort,
    })
    setData(res)
  }

  const openCreate = () => {
    setEditing(null)
    setRating('5')
    setComment('')
    setMovieId(moviesPick[0] ? String(moviesPick[0].id) : '')
    setUserId(usersPick[0] ? String(usersPick[0].id) : '')
    setModalOpen(true)
  }

  const openEdit = (r: Review) => {
    setEditing(r)
    setRating(String(r.rating))
    setComment(r.comment ?? '')
    setMovieId(String(r.movieId))
    setUserId(String(r.userId))
    setModalOpen(true)
  }

  const save = async () => {
    const r = Number(rating)
    const m = Number(movieId)
    const u = Number(userId)
    if (Number.isNaN(r) || Number.isNaN(m) || Number.isNaN(u)) return
    try {
      setError(null)
      const body = {
        rating: r,
        comment: comment.trim() || null,
        movieId: m,
        userId: u,
      }
      if (editing) await updateReview(editing.id, body)
      else await createReview(body)
      setModalOpen(false)
      await refresh()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  const remove = async (id: number) => {
    if (!window.confirm('Delete this review?')) return
    try {
      setError(null)
      await deleteReview(id)
      await refresh()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Reviews</h2>
          <p className="text-sm text-ink-muted">Filter by movie or user, manage ratings</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-pastel-green px-4 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-pastel-green-deep/30 hover:bg-pastel-green-deep/30"
        >
          Add review
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex min-w-[160px] flex-1 flex-col gap-1 text-sm text-ink-muted">
          Movie
          <select
            className="rounded-xl border border-pastel-purple-deep/35 bg-white px-3 py-2 text-ink"
            value={movieFilter}
            onChange={(e) => setMovieFilter(e.target.value)}
          >
            <option value="">All movies</option>
            {moviesPick.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[160px] flex-1 flex-col gap-1 text-sm text-ink-muted">
          User
          <select
            className="rounded-xl border border-pastel-purple-deep/35 bg-white px-3 py-2 text-ink"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="">All users</option>
            {usersPick.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Sort
          <select
            className="rounded-xl border border-pastel-purple-deep/35 bg-white px-3 py-2 text-ink"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="id,asc">ID ascending</option>
            <option value="id,desc">ID descending</option>
            <option value="rating,asc">Rating ascending</option>
            <option value="rating,desc">Rating descending</option>
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
          <thead className="bg-pastel-pink/40 text-ink">
            <tr>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">Comment</th>
              <th className="px-4 py-3 font-semibold">Movie</th>
              <th className="px-4 py-3 font-semibold">User</th>
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
                  No reviews found
                </td>
              </tr>
            ) : (
              data?.content.map((r) => (
                <tr key={r.id} className="border-t border-pastel-purple-deep/15 odd:bg-white/70">
                  <td className="px-4 py-3 font-semibold text-ink">{r.rating}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-ink-muted" title={r.comment ?? ''}>
                    {r.comment ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-ink">{r.movieTitle}</td>
                  <td className="px-4 py-3 text-ink-muted">{r.userName}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="mr-2 rounded-lg bg-pastel-blue/80 px-2 py-1 text-xs font-medium text-ink hover:bg-pastel-blue"
                      onClick={() => openEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-pastel-pink/90 px-2 py-1 text-xs font-medium text-ink hover:bg-pastel-pink-deep/50"
                      onClick={() => remove(r.id)}
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
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-pastel-purple-deep/25">
            <h3 className="text-lg font-semibold text-ink">
              {editing ? 'Edit review' : 'New review'}
            </h3>
            <label className="mt-4 flex flex-col gap-1 text-sm text-ink-muted">
              Rating (1–5)
              <select
                className="rounded-xl border border-pastel-purple-deep/35 px-3 py-2 text-ink"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm text-ink-muted">
              Comment
              <textarea
                rows={3}
                className="rounded-xl border border-pastel-purple-deep/35 px-3 py-2 text-ink"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm text-ink-muted">
              Movie
              <select
                className="rounded-xl border border-pastel-purple-deep/35 px-3 py-2 text-ink"
                value={movieId}
                onChange={(e) => setMovieId(e.target.value)}
              >
                {moviesPick.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm text-ink-muted">
              User
              <select
                className="rounded-xl border border-pastel-purple-deep/35 px-3 py-2 text-ink"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              >
                {usersPick.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
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
                disabled={!movieId || !userId}
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
