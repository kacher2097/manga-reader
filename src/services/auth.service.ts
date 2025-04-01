// services/auth.service.ts
import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest, SocialLoginRequest, User } from '@/types/auth';
import { ref } from 'vue';

const API_URL = 'http://localhost:8118/auth';

// Mock data cho môi trường dev
const MOCK_ADMIN_USER: User = {
  id: 'admin-1',
  username: 'admin',
  email: 'admin@example.com',
  fullName: 'Administrator',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=FF6B6B&color=fff',
  role: 'ADMIN'
};

const MOCK_NORMAL_USER: User = {
  id: 'user-1',
  username: 'user',
  email: 'user@example.com',
  fullName: 'Normal User',
  avatar: 'https://ui-avatars.com/api/?name=User&background=4C51BF&color=fff',
  role: 'USER'
};

export class AuthService {
  private static instance: AuthService;
  private _token = ref<string | null>(null);
  private _refreshToken = ref<string | null>(null);
  private _user = ref<User | null>(null);
  private _loading = ref(false);
  private static readonly AUTH_STORAGE_KEY = 'auth_data';
  private static readonly SESSION_DURATION_DAYS = 7;

  private constructor() {
    this.initializeFromStorage();
    this.setupStorageListener();
  }

  private setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === AuthService.AUTH_STORAGE_KEY) {
        this.initializeFromStorage();
      }
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async initializeFromStorage() {
    const authData = localStorage.getItem(AuthService.AUTH_STORAGE_KEY);
    if (authData) {
      try {
        const { token, refreshToken, user, expiry } = JSON.parse(authData);
        const expiryDate = new Date(expiry);

        if (new Date() < expiryDate) {
          this._token.value = token;
          this._refreshToken.value = refreshToken;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Gọi API /me để lấy thông tin user mới nhất
          try {
            const currentUser = await this.getCurrentUser();
            this._user.value = currentUser;
          } catch (error) {
            console.error('Failed to get current user:', error);
            await this.refreshAccessToken(); // Thử refresh token nếu token hết hạn
          }
        } else {
          await this.refreshAccessToken(); // Token hết hạn, thử refresh
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        this.clearAuth();
      }
    }
  }

  public async login(data: LoginRequest): Promise<AuthResponse> {
    this._loading.value = true;
    try {
      console.log('Login request:', data);
      const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
      this.setAuth(response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Login failed');
    } finally {
      this._loading.value = false;
    }
  }

  public async register(data: RegisterRequest): Promise<AuthResponse> {
    this._loading.value = true;
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
      this.setAuth(response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Registration failed');
    } finally {
      this._loading.value = false;
    }
  }

  public async socialLogin(data: SocialLoginRequest): Promise<AuthResponse> {
    this._loading.value = true;
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/social-login`, data);
      this.setAuth(response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Social login failed');
    } finally {
      this._loading.value = false;
    }
  }

  public async getCurrentUser(): Promise<User> {
    if (!this._token.value) throw new Error('No token available');
    try {
      const response = await axios.get<User>(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${this._token.value}` }
      });
      this._user.value = response.data;
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await this.refreshAccessToken();
        return this.getCurrentUser(); // Thử lại sau khi refresh
      }
      throw error;
    }
  }

  public async refreshAccessToken(): Promise<void> {
    if (!this._refreshToken.value) {
      this.clearAuth();
      throw new Error('No refresh token available');
    }

    this._loading.value = true;
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/refresh`, {
        refreshToken: this._refreshToken.value
      });
      this.setAuth(response.data);
    } catch (error) {
      this.clearAuth();
      throw this.handleError(error, 'Failed to refresh token');
    } finally {
      this._loading.value = false;
    }
  }

  public logout(): void {
    this.clearAuth();
  }

  private setAuth(auth: AuthResponse): void {
    this._token.value = auth.token;
    this._refreshToken.value = auth.refreshToken;
    this._user.value = auth.user;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + AuthService.SESSION_DURATION_DAYS);

    const authData = {
      token: auth.token,
      refreshToken: auth.refreshToken,
      user: auth.user,
      expiry: expiryDate.toISOString()
    };

    localStorage.setItem(AuthService.AUTH_STORAGE_KEY, JSON.stringify(authData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
  }

  private clearAuth(): void {
    this._token.value = null;
    this._user.value = null;
    localStorage.removeItem(AuthService.AUTH_STORAGE_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }

  private handleError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.message || defaultMessage);
    }
    return new Error(defaultMessage);
  }

  public get token() {
    return this._token.value;
  }

  public get user() {
    return this._user.value;
  }

  public get loading() {
    return this._loading.value;
  }

  public isAuthenticated(): boolean {
    return !!this._token.value && !!this._user.value;
  }

  public isAdmin(): boolean {
    return this._user.value?.role === 'ADMIN';
  }

  public static isAuthenticated(): boolean {
    const instance = AuthService.getInstance();
    return instance.isAuthenticated();
  }
  
  public static isAdmin(): boolean {
    const instance = AuthService.getInstance();
    return instance.isAdmin();
  }
}