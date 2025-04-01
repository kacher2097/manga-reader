import axios from 'axios'
import type { AuthResponse, LoginRequest, RegisterRequest, SocialLoginRequest, User } from '@/types/auth'

const API_URL = 'http://localhost:8118/auth'

// Mock data cho môi trường dev
const MOCK_ADMIN_USER: User = {
  id: 'admin-1',
  username: 'admin',
  email: 'admin@example.com',
  fullName: 'Administrator',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=FF6B6B&color=fff',
  role: 'ADMIN'
}

const MOCK_NORMAL_USER: User = {
  id: 'user-1',
  username: 'user',
  email: 'user@example.com',
  fullName: 'Normal User',
  avatar: 'https://ui-avatars.com/api/?name=User&background=4C51BF&color=fff',
  role: 'USER'
}

export class AuthService {
  private static token: string | null = null
  private static user: User | null = null
  private static readonly TOKEN_EXPIRY_KEY = 'token_expiry'
  private static readonly SESSION_DURATION_DAYS = 7

  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Kiểm tra nếu đang chạy ở môi trường phát triển và không có API
      if (import.meta.env.DEV && (import.meta.env.VITE_USE_MOCK === 'true' || !API_URL)) {
        console.log('Sử dụng mock data cho đăng nhập')
        
        // Giả lập delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Kiểm tra thông tin đăng nhập
        if (data.username === 'admin' && data.password === 'admin') {
          // Tài khoản admin
          const mockResponse: AuthResponse = {
            user: MOCK_ADMIN_USER,
            token: 'mock-admin-token'
          }
          this.setAuth(mockResponse)
          return mockResponse
        } else if (data.username === 'user' && data.password === 'user') {
          // Tài khoản người dùng thường
          const mockResponse: AuthResponse = {
            user: MOCK_NORMAL_USER,
            token: 'mock-user-token'
          }
          this.setAuth(mockResponse)
          return mockResponse
        }
        
        // Nếu đăng nhập thất bại
        throw new Error('Đăng nhập thất bại')
      }
      
      // Nếu có API thực tế
      const response = await axios.post<AuthResponse>(`${API_URL}/login`, data)
      this.setAuth(response.data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw {
          response: {
            data: {
              message: error.message || 'Đăng nhập thất bại'
            }
          }
        }
      }
      throw error
    }
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Kiểm tra nếu đang chạy ở môi trường phát triển và không có API
      if (import.meta.env.DEV && (import.meta.env.VITE_USE_MOCK === 'true' || !API_URL)) {
        console.log('Sử dụng mock data cho đăng ký')
        
        // Giả lập delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Tạo user mới
        const newUser: User = {
          id: `user-${Date.now()}`,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=4C51BF&color=fff`,
          role: 'USER'
        }
        
        const mockResponse: AuthResponse = {
          user: newUser,
          token: `mock-token-${Date.now()}`
        }
        
        this.setAuth(mockResponse)
        return mockResponse
      }
      
      // Nếu có API thực tế
      const response = await axios.post<AuthResponse>(`${API_URL}/register`, data)
      this.setAuth(response.data)
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw {
          response: {
            data: {
              message: error.message || 'Đăng ký thất bại'
            }
          }
        }
      }
      throw error
    }
  }

  static async socialLogin(data: SocialLoginRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/social-login`, data)
    this.setAuth(response.data)
    return response.data
  }

  static async getCurrentUser(): Promise<User> {
    // Nếu đang sử dụng mock data trong môi trường phát triển
    if (import.meta.env.DEV && (import.meta.env.VITE_USE_MOCK === 'true' || !API_URL)) {
      console.log('Sử dụng mock data cho getCurrentUser')
      
      // Kiểm tra token mock
      const token = this.getToken()
      if (!token) {
        throw new Error('Không có token')
      }
      
      if (token === 'mock-admin-token') {
        this.user = MOCK_ADMIN_USER
        return MOCK_ADMIN_USER
      } else if (token.startsWith('mock-')) {
        // Tài khoản thường
        this.user = MOCK_NORMAL_USER
        return MOCK_NORMAL_USER
      }
      
      throw new Error('Token không hợp lệ')
    }
    
    // Nếu có API thực tế
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
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY)
    delete axios.defaults.headers.common['Authorization']
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static isAdmin(): boolean {
    return this.getUser()?.role === 'ADMIN'
  }

  static getToken(): string | null {
    if (!this.token) {
      // Kiểm tra token và thời gian hết hạn
      const storedToken = localStorage.getItem('token')
      const tokenExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY)
      
      if (storedToken && tokenExpiry) {
        const expiryDate = new Date(tokenExpiry)
        const currentDate = new Date()
        
        // Nếu token còn hạn, sử dụng nó
        if (expiryDate > currentDate) {
          this.token = storedToken
        } else {
          // Nếu token hết hạn, xóa dữ liệu
          this.logout()
          return null
        }
      } else {
        this.token = storedToken
      }
    }
    return this.token
  }

  static getUser(): User | null {
    if (!this.user) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          this.user = JSON.parse(userStr)
        } catch (e) {
          console.error('Failed to parse user from localStorage:', e)
          localStorage.removeItem('user')
        }
      }
    }
    return this.user
  }

  private static setAuth(auth: AuthResponse): void {
    this.token = auth.token
    this.user = auth.user
    
    // Thiết lập thời gian hết hạn cho token (7 ngày)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + this.SESSION_DURATION_DAYS)
    
    // Lưu token, user và thời gian hết hạn vào localStorage
    localStorage.setItem('token', auth.token)
    localStorage.setItem('user', JSON.stringify(auth.user))
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryDate.toISOString())
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`
  }
} 