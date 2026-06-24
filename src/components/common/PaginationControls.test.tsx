import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { PaginationControls } from './PaginationControls'

describe('PaginationControls', () => {
  afterEach(() => {
    cleanup()
  })

  test('shows the current range and moves to previous or next page', () => {
    const onPageChange = vi.fn()

    render(
      <PaginationControls
        currentPage={2}
        pageSize={10}
        totalCount={25}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    )

    expect(screen.getByText('11-20 / 25 ta yozuv')).toBeTruthy()
    expect(screen.getByText('Sahifa 2 / 3')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Oldingi sahifa' }))
    fireEvent.click(screen.getByRole('button', { name: 'Keyingi sahifa' }))

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3)
  })

  test('disables navigation at the available page boundaries', () => {
    const onPageChange = vi.fn()

    render(
      <PaginationControls
        currentPage={1}
        pageSize={10}
        totalCount={4}
        totalPages={1}
        onPageChange={onPageChange}
      />,
    )

    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Oldingi sahifa' }).disabled).toBe(true)
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Keyingi sahifa' }).disabled).toBe(true)
    expect(screen.getByText('1-4 / 4 ta yozuv')).toBeTruthy()
  })
})
