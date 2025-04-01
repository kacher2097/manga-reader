// composables/useAuth.ts
import { AuthService } from '@/services/auth.service';
import type { LoginRequest, RegisterRequest, SocialLoginRequest, AuthResponse, User } from '@/types/auth';
import { useRouter } from 'vue-router';

export function useAuth() {
  const authService = AuthService.getInstance();
  const router = useRouter();

  const login = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await authService.login(data);
      
      // Chuyển hướng dựa trên vai trò người dùng
      if (response.user.role === 'ADMIN') {
        await router.push('/admin');
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await authService.register(data);
      
      // Chuyển hướng dựa trên vai trò người dùng
      if (response.user.role === 'ADMIN') {
        await router.push('/admin');
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const socialLogin = async (data: SocialLoginRequest): Promise<AuthResponse> => {
    return authService.socialLogin(data);
  };

  const refreshToken = async (): Promise<void> => {
    return authService.refreshAccessToken();
  };

  const logout = () => {
    authService.logout();
  };

  const getCurrentUser = async (): Promise<User> => {
    return authService.getCurrentUser();
  };
  
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };
  
  const isAdmin = () => {
    return authService.isAdmin();
  };

  return {
    login,
    register,
    socialLogin,
    logout,
    getCurrentUser,
    refreshToken,
    token: authService.token,
    user: authService.user,
    loading: authService.loading,
    isAuthenticated,
    isAdmin
  };
}