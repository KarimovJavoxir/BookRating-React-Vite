interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Maʼlumotlar yuklanmoqda...' }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="visually-hidden">{message}</span>
      <div className="book-grid">
      {[1, 2, 3, 4].map((n) => (
        <article
          key={n}
          aria-label="Yuklanmoqda"
          className="book-card skeleton-box"
          style={{ minHeight: '214px', border: 'none' }}
        >
          <div className="skeleton-box" style={{ width: '92px', minHeight: '138px', background: 'var(--border)' }} />
          <div className="book-card__content">
            <div>
              <div className="skeleton-box" style={{ height: '16px', width: '40%', marginBottom: '12px', background: 'var(--border)' }} />
              <div className="skeleton-box" style={{ height: '24px', width: '80%', marginBottom: '8px', background: 'var(--border)' }} />
              <div className="skeleton-box" style={{ height: '24px', width: '60%', marginBottom: '16px', background: 'var(--border)' }} />
            </div>
            <div className="skeleton-box" style={{ height: '20px', width: '50%', background: 'var(--border)' }} />
            <div className="skeleton-box" style={{ height: '42px', width: '80px', borderRadius: '8px', marginTop: 'auto', background: 'var(--border)' }} />
          </div>
        </article>
      ))}
      </div>
    </div>
  )
}
