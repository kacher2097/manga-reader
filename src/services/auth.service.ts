import axios from 'axios'
import type { AuthResponse, LoginRequest, RegisterRequest, SocialLoginRequest, User } from '@/types/auth'

const API_URL = 'http://localhost:8080/api/auth'

export class AuthService {
  private static token: string | null = null
  private static user: User | null = null

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, data)
    this.setAuth(response.data)
    return response.data
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, data)
    this.setAuth(response.data)
    return response.data
  }

  static async socialLogin(data: SocialLoginRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/social-login`, data)
    this.setAuth(response.data)
    return response.data
  }

  static async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('Không có token')
    }
    const response = await axios.get<User>(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })
    this.user = response.data
    return response.data
  }

  static logout(): void {
    this.token = null
    this.user = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  static isAuthenticated(): boolean {
    return !!this.token
  }

  static isAdmin(): boolean {
    return this.user?.role === 'admin'
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token')
    }
    return this.token
  }

  static getUser(): User | null {
    if (!this.user) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        this.user = JSON.parse(userStr)
      }
    }
    return this.user
  }

  private static setAuth(auth: AuthResponse): void {
    this.token = auth.token
    this.user = auth.user
    localStorage.setItem('token', auth.token)
    localStorage.setItem('user', JSON.stringify(auth.user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`
  }
} 