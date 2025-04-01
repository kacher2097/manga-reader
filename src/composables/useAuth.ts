import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/auth.service'
import type { User } from '@/types/auth'
import { handlePostLogin } from '@/router'

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const router = useRouter()
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  const getCurrentUser = async () => {
    try {
      loading.value = true
      const token = localStorage.getItem('token')
      if (!token) {
        user.value = null
        return null
      }
      const response = await AuthService.getCurrentUser()
      user.value = response
      return response
    } catch (err) {
      console.error('Failed to get current user:', err)
      error.value = 'Không thể lấy thông tin người dùng'
      // Nếu lỗi 401 hoặc token không hợp lệ, xóa token và user
      localStorage.removeItem('token')
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const login = async (data: { username: string, password: string }) => {
    try {
      loading.value = true
      const response = await AuthService.login(data)
      localStorage.setItem('token', response.token)
      user.value = response.user
      
      // Xử lý chuyển hướng dựa trên vai trò người dùng
      if (response.user.role === 'ADMIN') {
        // Nếu là admin, chuyển hướng đến trang admin
        await router.push('/admin')
      } else {
        // Nếu là người dùng thường, chuyển hướng đến trang chủ
        await router.push('/')
      }
      
      return user.value
    } catch (err) {
      console.error('Login failed:', err)
      error.value = 'Đăng nhập thất bại'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      AuthService.logout() // Gọi logout từ AuthService để xử lý việc xóa token
      user.value = null
      // Chuyển hướng về trang đăng nhập
      await router.push('/login')
    } catch (err) {
      console.error('Logout failed:', err)
      error.value = 'Đăng xuất thất bại'
    }
  }

  async function register(data: { username: string; email: string; password: string; fullName: string }) {
    try {
      loading.value = true
      error.value = null
      const response = await AuthService.register(data)
      user.value = response.user
      
      // Xử lý chuyển hướng dựa vào vai trò người dùng sau khi đăng ký
      if (response.user.role === 'ADMIN') {
        await router.push('/admin')
      } else {
        await router.push('/')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra'
    } finally {
      loading.value = false
    }
  }

  async function socialLogin(accessToken: string, provider: 'GOOGLE' | 'FACEBOOK') {
    try {
      loading.value = true
      error.value = null
      const response = await AuthService.socialLogin({ accessToken, provider })
      user.value = response.user
      
      // Xử lý chuyển hướng dựa vào vai trò người dùng sau khi đăng nhập qua mạng xã hội
      if (response.user.role === 'ADMIN') {
        await router.push('/admin')
      } else {
        await router.push('/')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra'
    } finally {
      loading.value = false
    }
  }

  // Kiểm tra xác thực khi ứng dụng khởi động
  const checkAuth = async () => {
    const userData = await getCurrentUser()
    const currentPath = router.currentRoute.value.path
    if (userData && userData.role === 'ADMIN') {
      // Nếu là admin, kiểm tra nếu đang không ở trang admin thì chuyển hướng
      if (!currentPath.startsWith('/admin')) {
        router.push('/admin')
      }
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    socialLogin,
    logout,
    getCurrentUser,
    checkAuth
  }
} 