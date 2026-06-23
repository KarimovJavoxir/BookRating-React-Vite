const defaultApiBaseUrl = 'http://localhost:5099'

interface ApiClientEnvironment {
  VITE_API_BASE_URL?: string
  PROD?: boolean
}

let unauthorizedHandler: (() => void) | null = null

export const apiBaseUrl = resolveApiBaseUrl()

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

export interface ApiRequestOptions {
  authToken?: string
}

export function resolveApiBaseUrl(env: ApiClientEnvironment = import.meta.env): string {
  const configuredBaseUrl = env.VITE_API_BASE_URL?.trim()

  if (!configuredBaseUrl && env.PROD) {
    throw new Error('VITE_API_BASE_URL production uchun majburiy.')
  }

  return (configuredBaseUrl || defaultApiBaseUrl).replace(/\/$/, '')
}

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler
}

export function clearUnauthorizedHandler(): void {
  unauthorizedHandler = null
}

export async function getJson<TResponse>(
  path: string,
  options?: ApiRequestOptions,
): Promise<TResponse> {
  return requestJson<TResponse>(path, undefined, options)
}

export async function postJson<TResponse>(
  path: string,
  body: unknown,
  options?: ApiRequestOptions,
): Promise<TResponse> {
  return requestJson<TResponse>(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }, options)
}

export async function putJson<TResponse>(
  path: string,
  body: unknown,
  options?: ApiRequestOptions,
): Promise<TResponse> {
  return requestJson<TResponse>(path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }, options)
}

export async function deleteJson(path: string, options?: ApiRequestOptions): Promise<void> {
  return requestJson<void>(path, { method: 'DELETE' }, options)
}

async function requestJson<TResponse>(
  path: string,
  init?: RequestInit,
  options?: ApiRequestOptions,
): Promise<TResponse> {
  const requestInit = buildRequestInit(init, options)
  const response = await fetch(buildApiUrl(path), requestInit)

  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && options?.authToken) {
      unauthorizedHandler?.()
    }

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

function buildRequestInit(init?: RequestInit, options?: ApiRequestOptions): RequestInit | undefined {
  if (!init && !options?.authToken) {
    return undefined
  }

  return {
    ...init,
    headers: buildHeaders(init?.headers, options?.authToken),
  }
}

function buildHeaders(headers?: HeadersInit, authToken?: string): HeadersInit | undefined {
  const mergedHeaders: Record<string, string> = {}

  if (authToken) {
    mergedHeaders.Authorization = `Bearer ${authToken}`
  }

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      mergedHeaders[key] = value
    })
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      mergedHeaders[key] = value
    })
  } else if (headers) {
    Object.assign(mergedHeaders, headers)
  }

  return Object.keys(mergedHeaders).length > 0 ? mergedHeaders : undefined
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
