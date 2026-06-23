import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { LoadingState } from './LoadingState'

describe('LoadingState', () => {
  test('announces the loading message while showing skeleton items', () => {
    render(<LoadingState message="Kitoblar yuklanmoqda..." />)

    expect(screen.getByRole('status').textContent).toContain('Kitoblar yuklanmoqda...')
    expect(screen.getAllByLabelText('Yuklanmoqda')).toHaveLength(4)
  })
})
