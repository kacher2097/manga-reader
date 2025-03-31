import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '@/types/auth'
import { AuthService } from '@/services/auth.service'

export function useAuth() {
  const router = useRouter()
  const user = ref<User | null>(AuthService.getUser())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(username: string, password: string) {
    try {
      isLoading.value = true
      error.value = null
      const response = await AuthService.login({ username, password })
      user.value = response.user
      
      // Chuyển hướng sau khi đăng nhập
      const redirect = router.currentRoute.value.query.redirect as string
      await router.push(redirect || '/')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra'
    } finally {
      isLoading.value = false
    }
  }

  async function register(data: { username: string; email: string; password: string; fullName: string }) {
    try {
      isLoading.value = true
      error.value = null
      const response = await AuthService.register(data)
      user.value = response.user
      await router.push('/')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra'
    } finally {
      isLoading.value = false
    }
  }

  async function socialLogin(accessToken: string, provider: 'GOOGLE' | 'FACEBOOK') {
    try {
      isLoading.value = true
      error.value = null
      const response = await AuthService.socialLogin({ accessToken, provider })
      user.value = response.user
      await router.push('/')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra'
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    AuthService.logout()
    user.value = null
    await router.push('/login')
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    socialLogin,
    logout
  }
} 