import type {
  AdminBookRating,
  AdminDashboard,
  AdminDashboardFilters,
  AdminUser,
} from '../types/admin'
import { getJson } from './apiClient'

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

export async function getAdminUsers(authToken: string): Promise<AdminUser[]> {
  return getJson<AdminUser[]>('/api/admin/users', { authToken })
}

export async function getAdminRatings(authToken: string): Promise<AdminBookRating[]> {
  return getJson<AdminBookRating[]>('/api/admin/ratings', { authToken })
}
