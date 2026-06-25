import { useState, type FormEvent } from 'react'
import type { RatingSubmission, RatingValue } from '../../types/rating'

interface RatingFormProps {
  onSubmit: (submission: RatingSubmission) => Promise<void>
}

const ratingOptions: RatingValue[] = [1, 2, 3, 4, 5]

export function RatingForm({ onSubmit }: RatingFormProps) {
  const [value, setValue] = useState<RatingValue>(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      await onSubmit({
        value,
        comment,
      })
      setComment('')
      setStatusMessage('Baholash qabul qilindi. Izoh moderatsiyadan keyin koʻrinadi.')
    } catch {
      setStatusMessage('Baholashni yuborishda xatolik yuz berdi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="rating-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Kitobni baholash</legend>
        <div className="rating-options">
          {ratingOptions.map((option) => (
            <label
              key={option}
              className={option === value ? 'rating-option active' : 'rating-option'}
            >
              <input
                className="visually-hidden"
                type="radio"
                name="rating-value"
                value={option}
                checked={option === value}
                onChange={() => setValue(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="comment-field">
        <span>Izoh</span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          placeholder="Kitob haqida qisqa fikr yozing"
        />
      </label>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Yuborilmoqda...' : 'Baholash'}
      </button>

      {statusMessage ? <p className="form-status">{statusMessage}</p> : null}
    </form>
  )
}
