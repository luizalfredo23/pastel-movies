import { useEffect, useState } from 'react'
import { createUser, deleteUser, fetchUsersPage, updateUser } from '../api/usersApi'
import { PaginationBar } from '../components/PaginationBar'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { getErrorMessage } from '../lib/httpError'
import type { AppUser, SpringPage } from '../types'

export function UsersPage() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 350)
  const [sort, setSort] = useState('name,asc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SpringPage<AppUser> | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AppUser | null>(null)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')

  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, size, sort])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchUsersPage({
          page,
          size,
          search: debouncedSearch.trim() || undefined,
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
  }, [page, size, debouncedSearch, sort])

  const refresh = async () => {
    const res = await fetchUsersPage({
      page,
      size,
      search: debouncedSearch.trim() || undefined,
      sort,
    })
    setData(res)
  }

  const openCreate = () => {
    setEditing(null)
    setFormName('')
    setFormEmail('')
    setModalOpen(true)
  }

  const openEdit = (u: AppUser) => {
    setEditing(u)
    setFormName(u.name)
    setFormEmail(u.email)
    setModalOpen(true)
  }

  const save = async () => {
    try {
      setError(null)
      const body = { name: formName.trim(), email: formEmail.trim() }
      if (editing) await updateUser(editing.id, body)
      else await createUser(body)
      setModalOpen(false)
      await refresh()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  const remove = async (id: number) => {
    if (!window.confirm('Delete this user?')) return
    try {
      setError(null)
      await deleteUser(id)
      await refresh()
    } catch (e) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Users</h2>
          <p className="text-sm text-ink-muted">Browse and manage users</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-pastel-green px-4 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-pastel-green-deep/30 hover:bg-pastel-green-deep/30"
        >
          Add user
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm text-ink-muted">
          Search
          <input
            className="rounded-xl border border-pastel-purple-deep/35 bg-white px-3 py-2 text-ink shadow-inner"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Name or email…"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Sort
          <select
            className="rounded-xl border border-pastel-purple-deep/35 bg-white px-3 py-2 text-ink"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name,asc">Name A–Z</option>
            <option value="name,desc">Name Z–A</option>
            <option value="email,asc">Email A–Z</option>
            <option value="email,desc">Email Z–A</option>
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
          <thead className="bg-pastel-green/40 text-ink">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                  Loading…
                </td>
              </tr>
            ) : data?.empty ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                  No users found
                </td>
              </tr>
            ) : (
              data?.content.map((u) => (
                <tr key={u.id} className="border-t border-pastel-purple-deep/15 odd:bg-white/70">
                  <td className="px-4 py-3 text-ink-muted">{u.id}</td>
                  <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="mr-2 rounded-lg bg-pastel-blue/80 px-2 py-1 text-xs font-medium text-ink hover:bg-pastel-blue"
                      onClick={() => openEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-pastel-pink/90 px-2 py-1 text-xs font-medium text-ink hover:bg-pastel-pink-deep/50"
                      onClick={() => remove(u.id)}
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
              {editing ? 'Edit user' : 'New user'}
            </h3>
            <label className="mt-4 flex flex-col gap-1 text-sm text-ink-muted">
              Name
              <input
                className="rounded-xl border border-pastel-purple-deep/35 px-3 py-2 text-ink"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm text-ink-muted">
              Email
              <input
                type="email"
                className="rounded-xl border border-pastel-purple-deep/35 px-3 py-2 text-ink"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
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
                disabled={!formName.trim() || !formEmail.trim()}
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
