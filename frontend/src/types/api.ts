// API Response Types
// Task: T067 - Define API response types

export interface ApiResponse<T> {
    data: T
    message?: string
}

export interface ApiError {
    error: string
    message: string
    code?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
}

export interface ValidationError {
    field: string
    message: string
    code: string
}

export interface ValidationErrorResponse {
    error: string
    message: string
    code: 'VALIDATION_ERROR'
    details: ValidationError[]
}
