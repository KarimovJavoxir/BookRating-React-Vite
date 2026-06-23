import { useState } from 'react'
import type { Book } from '../../types/book'
import { resolveMediaUrl } from '../../utils/mediaUrl'

interface BookCoverProps {
  book: Book
}

export function BookCover({ book }: BookCoverProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasLoadError, setHasLoadError] = useState(false)
  const coverImageUrl = hasLoadError ? undefined : resolveMediaUrl(book.coverImageUrl)

  if (!coverImageUrl) {
    return (
      <div className="book-cover book-cover--placeholder">
        {book.title.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className="book-cover-frame">
      {!isLoaded && <div className="book-cover book-cover--skeleton skeleton-box" />}
      <img
        src={coverImageUrl}
        alt={`${book.title} muqovasi`}
        className={`book-cover book-cover--image ${isLoaded ? 'fade-in' : 'book-cover--loading'}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasLoadError(true)}
      />
    </div>
  )
}
