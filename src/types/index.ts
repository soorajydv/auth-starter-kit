// Common types used across the application

export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  success: boolean
  count: number
  totalPages: number
  currentPage: number
  data: T[]
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}