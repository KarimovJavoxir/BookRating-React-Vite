import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { RatingForm } from './RatingForm'

describe('RatingForm', () => {
  afterEach(() => {
    cleanup()
  })

  test('explains that submitted reviews wait for moderation', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<RatingForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Baholash' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ value: 5, comment: '' })
    })
    expect(await screen.findByText('Baholash qabul qilindi. Izoh moderatsiyadan keyin koʻrinadi.')).toBeTruthy()
  })

  test('uses radio semantics for rating selection', () => {
    render(<RatingForm onSubmit={vi.fn()} />)

    expect((screen.getByRole('radio', { name: '5' }) as HTMLInputElement).checked).toBe(true)

    fireEvent.click(screen.getByRole('radio', { name: '3' }))

    expect((screen.getByRole('radio', { name: '3' }) as HTMLInputElement).checked).toBe(true)
    expect((screen.getByRole('radio', { name: '5' }) as HTMLInputElement).checked).toBe(false)
  })

  test('shows duplicate rating error from the backend', async () => {
    const onSubmit = vi.fn().mockRejectedValue(
      new Error('Siz bu kitobga allaqachon baho qoldirgansiz.'),
    )

    render(<RatingForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Baholash' }))

    expect(await screen.findByText('Siz bu kitobga allaqachon baho qoldirgansiz.')).toBeTruthy()
  })
})
