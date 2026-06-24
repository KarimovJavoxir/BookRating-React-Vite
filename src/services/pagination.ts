import type { PaginationParams } from '../types/api'

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10
export const FULL_LIST_PAGE_SIZE = 100

export function toPaginationQueryString(pagination: PaginationParams = {}): string {
  const params = new URLSearchParams()
  params.set('page', String(pagination.page ?? DEFAULT_PAGE))
  params.set('pageSize', String(pagination.pageSize ?? DEFAULT_PAGE_SIZE))
  return params.toString()
}
