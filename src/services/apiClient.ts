const normalizedBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

export const apiBaseUrl = normalizedBaseUrl.replace(/\/$/, '')

export function isApiConfigured(): boolean {
  return apiBaseUrl.length > 0
}

export async function getJson<TResponse>(path: string): Promise<TResponse> {
  if (!isApiConfigured()) {
    throw new Error('API manzili sozlanmagan. Hozircha frontend mock maʼlumotlardan foydalanadi.')
  }

  const response = await fetch(`${apiBaseUrl}${path}`)

  if (!response.ok) {
    throw new Error(`API soʻrovi bajarilmadi: ${response.status}`)
  }

  return response.json() as Promise<TResponse>
}
