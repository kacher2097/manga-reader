export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  fullName: string
}

export interface SocialLoginRequest {
  accessToken: string
  provider: 'GOOGLE' | 'FACEBOOK'
}

export interface User {
  id: string
  username: string
  email: string
  fullName?: string
  avatar?: string
  role: 'admin' | 'user'
}

export interface AuthResponse {
  token: string
  user: User
} 