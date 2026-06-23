import { apiBaseUrl } from '../services/apiClient'

export function resolveMediaUrl(value?: string | null): string | undefined {
  const mediaUrl = value?.trim()
  if (!mediaUrl) {
    return undefined
  }

  return new URL(mediaUrl, `${apiBaseUrl}/`).toString()
}
