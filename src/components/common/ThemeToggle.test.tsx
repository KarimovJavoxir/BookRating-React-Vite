import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  test('uses the correct Uzbek letter in the accessible name', () => {
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Mavzuni oʻzgartirish' })).toBeTruthy()
  })
})
