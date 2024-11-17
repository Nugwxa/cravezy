export interface ApiResponse<T = unknown, A = unknown> {
  success: boolean
  message: string
  data?: T
  statusCode: number
  errors?: A[]
}
