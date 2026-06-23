import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'
import { LoadingState } from './LoadingState'

describe('LoadingState', () => {
  afterEach(() => {
    cleanup()
  })

  test('announces the loading message while showing skeleton items', () => {
    render(<LoadingState message="Kitoblar yuklanmoqda..." />)

    expect(screen.getByRole('status').textContent).toContain('Kitoblar yuklanmoqda...')
    expect(screen.getAllByLabelText('Yuklanmoqda')).toHaveLength(3)
  })

  test('supports a custom skeleton item count', () => {
    render(<LoadingState itemCount={2} />)

    expect(screen.getAllByLabelText('Yuklanmoqda')).toHaveLength(2)
  })
})
