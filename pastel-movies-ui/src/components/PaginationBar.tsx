type Props = {
  page: number
  totalPages: number
  totalElements: number
  size: number
  onPageChange: (p: number) => void
  onSizeChange?: (s: number) => void
}

export function PaginationBar({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
  onSizeChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 border-t border-pastel-purple-deep/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-ink-muted">
        Page <span className="font-medium text-ink">{page + 1}</span> of{' '}
        <span className="font-medium text-ink">{Math.max(1, totalPages)}</span>
        <span className="mx-2 text-pastel-purple-deep">·</span>
        {totalElements} total
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {onSizeChange ? (
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            Per page
            <select
              className="rounded-xl border border-pastel-purple-deep/40 bg-white px-2 py-1.5 text-ink"
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button
          type="button"
          disabled={page <= 0}
          className="rounded-xl bg-pastel-blue px-3 py-1.5 text-sm font-medium text-ink shadow-sm transition enabled:hover:bg-pastel-blue-deep/40 disabled:opacity-40"
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages - 1 || totalPages === 0}
          className="rounded-xl bg-pastel-blue px-3 py-1.5 text-sm font-medium text-ink shadow-sm transition enabled:hover:bg-pastel-blue-deep/40 disabled:opacity-40"
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
