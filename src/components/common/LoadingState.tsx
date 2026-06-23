interface LoadingStateProps {
  message?: string
  itemCount?: number
}

export function LoadingState({ message = 'Maʼlumotlar yuklanmoqda...', itemCount = 3 }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="visually-hidden">{message}</span>
      <div className="book-grid">
        {Array.from({ length: itemCount }, (_, index) => index + 1).map((n) => (
          <article key={n} aria-label="Yuklanmoqda" className="book-card book-card--skeleton">
            <div className="book-cover skeleton-box" />
            <div className="book-card__content">
              <div>
                <div className="skeleton-box skeleton-line skeleton-line--short" />
                <div className="skeleton-box skeleton-line skeleton-line--title" />
                <div className="skeleton-box skeleton-line skeleton-line--medium" />
              </div>
              <div className="skeleton-box skeleton-line skeleton-line--rating" />
              <div className="skeleton-box skeleton-button" />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
