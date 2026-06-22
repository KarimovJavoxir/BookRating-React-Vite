const defaultApiBaseUrl = 'http://localhost:5099'
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || defaultApiBaseUrl

export const apiBaseUrl = configuredBaseUrl.replace(/\/$/, '')

interface ProblemDetailsResponse {
  title?: unknown
  detail?: unknown
}

export class ApiClientError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
  }
}

export async function getJson<TResponse>(path: string): Promise<TResponse> {
  return requestJson<TResponse>(path)
}

export async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  return requestJson<TResponse>(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

async function requestJson<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(buildApiUrl(path), init)

  if (!response.ok) {
    throw new ApiClientError(await getErrorMessage(response), response.status)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return response.json() as Promise<TResponse>
}

function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseUrl}${normalizedPath}`
}

async function getErrorMessage(response: Response): Promise<string> {
  const fallbackMessage = `API soʻrovi bajarilmadi: ${response.status}`

  try {
    const problem = (await response.json()) as ProblemDetailsResponse
    const title = typeof problem.title === 'string' ? problem.title : undefined
    const detail = typeof problem.detail === 'string' ? problem.detail : undefined
    const message = [title, detail].filter(Boolean).join(' ')

    return message || fallbackMessage
  } catch {
    return fallbackMessage
  }
}
