export interface ApiError {
  message: string
  status?: number
}

export interface ApiListResponse<T> {
  items: T[]
}
