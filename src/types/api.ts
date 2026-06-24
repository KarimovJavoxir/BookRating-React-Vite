export interface ApiError {
  message: string
  status?: number
}

export interface ApiListResponse<T> {
  items: T[]
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PagedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}
