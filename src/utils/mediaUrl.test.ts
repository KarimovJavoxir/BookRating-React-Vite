import { describe, expect, test } from 'vitest'
import { resolveMediaUrl } from './mediaUrl'

describe('resolveMediaUrl', () => {
  test('prefixes relative media paths with the backend API base URL', () => {
    expect(resolveMediaUrl('/uploads/books/cover.jpg')).toBe(
      'http://localhost:5099/uploads/books/cover.jpg',
    )
    expect(resolveMediaUrl('uploads/users/user-1.jpg')).toBe(
      'http://localhost:5099/uploads/users/user-1.jpg',
    )
  })

  test('keeps absolute media URLs unchanged', () => {
    expect(resolveMediaUrl('https://cdn.example.com/cover.jpg')).toBe(
      'https://cdn.example.com/cover.jpg',
    )
  })
})
