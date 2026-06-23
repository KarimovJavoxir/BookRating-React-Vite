export interface AuthUser {
  id: string
  username: string
  email: string
  profilePictureUrl?: string | null
  isAdmin: boolean
}

export interface AuthResult {
  token: string
  user: AuthUser
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}
