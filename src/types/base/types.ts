export interface ApiResponse<T = unknown> {
  status: number
  message?: string
  data?: T
  error?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type UserRole = "admin" | "customer"
