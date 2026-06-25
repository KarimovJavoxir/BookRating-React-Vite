import type {
  AdminBookRating,
  AdminDashboard,
  AdminDashboardFilters,
  AdminUser,
} from '../types/admin'
import type { PagedResponse, PaginationParams } from '../types/api'
import { getJson, postJson } from './apiClient'
import { toPaginationQueryString } from './pagination'

export async function getAdminDashboard(
  authToken: string,
  filters: AdminDashboardFilters = {},
): Promise<AdminDashboard> {
  const params = new URLSearchParams()
  if (filters.from) {
    params.set('from', filters.from)
  }

  if (filters.to) {
    params.set('to', filters.to)
  }

  const queryString = params.toString()
  const path = queryString ? `/api/admin/dashboard?${queryString}` : '/api/admin/dashboard'

  return getJson<AdminDashboard>(path, { authToken })
}

export async function getAdminUsers(
  authToken: string,
  pagination: PaginationParams = {},
): Promise<PagedResponse<AdminUser>> {
  return getJson<PagedResponse<AdminUser>>(`/api/admin/users?${toPaginationQueryString(pagination)}`, { authToken })
}

export async function getAdminRatings(
  authToken: string,
  pagination: PaginationParams = {},
): Promise<PagedResponse<AdminBookRating>> {
  return getJson<PagedResponse<AdminBookRating>>(`/api/admin/ratings?${toPaginationQueryString(pagination)}`, { authToken })
}

export async function acceptAdminRating(authToken: string, ratingId: string): Promise<void> {
  return postJson<void>(`/api/admin/ratings/${encodeURIComponent(ratingId)}/accept`, {}, { authToken })
}

export async function banAdminRating(authToken: string, ratingId: string, banReason: string): Promise<void> {
  return postJson<void>(
    `/api/admin/ratings/${encodeURIComponent(ratingId)}/ban`,
    { banReason },
    { authToken },
  )
}
