import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { UserAvatar } from './UserAvatar'

describe('UserAvatar', () => {
  test('uses the backend API base URL for relative profile photos', () => {
    render(<UserAvatar username="ali" profilePictureUrl="/uploads/users/ali.jpg" />)
    const image = screen.getByRole('img', { name: 'ali profili' })

    expect(image.getAttribute('src')).toBe('http://localhost:5099/uploads/users/ali.jpg')
  })

  test('shows a centered U placeholder when no profile photo exists', () => {
    render(<UserAvatar username="ali" />)
    const avatar = screen.getByText('U')

    expect(avatar.className).toContain('avatar')
    expect(avatar.getAttribute('aria-label')).toBe('Foydalanuvchi rasmi mavjud emas')
  })
})
