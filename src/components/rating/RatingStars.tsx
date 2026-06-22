interface RatingStarsProps {
  value: number
  ratingsCount?: number
  compact?: boolean
}

export function RatingStars({ value, ratingsCount, compact = false }: RatingStarsProps) {
  const roundedValue = Math.round(value)
  const stars = Array.from({ length: 5 }, (_, index) => index + 1)
  const ratingLabel = `${value.toFixed(1)} / 5`

  return (
    <div className={compact ? 'rating rating--compact' : 'rating'} aria-label={`Reyting ${ratingLabel}`}>
      <span className="rating-stars" aria-hidden="true">
        {stars.map((star) => (
          <span key={star} className={star <= roundedValue ? 'rating-star active' : 'rating-star'}>
            ★
          </span>
        ))}
      </span>
      <span className="rating-value">{ratingLabel}</span>
      {typeof ratingsCount === 'number' ? (
        <span className="rating-count">{ratingsCount} ta baho</span>
      ) : null}
    </div>
  )
}
