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
  role: 'ADMIN' | 'USER'
}

export interface AuthResponse {
  user: User;
  token: string;        // Access token
  refreshToken: string; // Refresh token
}