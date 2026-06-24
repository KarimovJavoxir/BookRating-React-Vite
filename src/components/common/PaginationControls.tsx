interface PaginationControlsProps {
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalCount === 0) {
    return null
  }

  const normalizedTotalPages = Math.max(1, totalPages)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= normalizedTotalPages

  return (
    <nav className="pagination-controls" aria-label="Sahifalash">
      <span className="pagination-range">
        {startItem}-{endItem} / {totalCount} ta yozuv
      </span>
      <div className="pagination-actions">
        <button
          className="secondary-button"
          type="button"
          aria-label="Oldingi sahifa"
          disabled={isFirstPage}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Oldingi
        </button>
        <span className="pagination-current">
          Sahifa {currentPage} / {normalizedTotalPages}
        </span>
        <button
          className="secondary-button"
          type="button"
          aria-label="Keyingi sahifa"
          disabled={isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Keyingi
        </button>
      </div>
    </nav>
  )
}
