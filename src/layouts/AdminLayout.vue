<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
      <div class="px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/admin" class="flex items-center">
            <h1 class="text-xl font-bold text-primary mr-2">Manga<span class="text-white">Hub</span></h1>
            <span class="text-sm bg-primary/20 text-primary px-2 py-0.5 rounded">Admin</span>
          </router-link>
        </div>
        <div class="flex items-center space-x-6">
          <router-link to="/" class="hover:text-primary transition-colors flex items-center" @click="handleHomeNavigation">
            <i class="fas fa-home mr-1.5"></i> Trang chủ
          </router-link>
          <div class="relative">
            <div class="flex items-center space-x-2 cursor-pointer group">
              <img 
                :src="userAvatar" 
                alt="Avatar" 
                class="w-8 h-8 rounded-full object-cover border border-gray-700"
              >
              <div class="flex items-center">
                <span class="text-sm group-hover:text-primary transition-colors">{{ userName }}</span>
                <i class="fas fa-chevron-down text-xs text-gray-400 ml-1 group-hover:text-primary transition-colors"></i>
              </div>
              <!-- Dropdown menu -->
              <div class="absolute right-0 top-full mt-1 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 z-50">
                <div class="py-1">
                  <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <i class="fas fa-user mr-2"></i> Trang cá nhân
                  </router-link>
                  <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                    <i class="fas fa-cog mr-2"></i> Cài đặt
                  </router-link>
                  <div class="border-t border-gray-700"></div>
                  <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                    <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <div class="w-64 bg-gray-800 min-h-screen sticky top-14 shadow-lg h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div class="p-4 border-b border-gray-700">
          <h2 class="text-lg font-bold text-primary">Quản trị hệ thống</h2>
        </div>
        <div class="mt-2">
          <div v-for="section in menuSections" :key="section.title" class="mb-4">
            <div class="px-4 py-1 mb-1 text-xs text-gray-400 uppercase font-semibold tracking-wider">{{ section.title }}</div>
            <router-link 
              v-for="item in section.items" 
              :key="item.path" 
              :to="item.path"
              class="flex items-center px-4 py-2.5 hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-700 border-l-4 border-primary text-white': isActive(item.path), 'text-gray-300': !isActive(item.path) }"
            >
              <i :class="[item.icon, 'mr-3 w-5 text-center', isActive(item.path) ? 'text-primary' : 'text-gray-400']"></i>
              <span>{{ item.title }}</span>
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1 overflow-x-hidden">
        <div class="p-6">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { AuthService } from '../services/auth.service'

const route = useRoute()
const router = useRouter()
const authInstance = AuthService.getInstance()
const user = computed(() => authInstance.user)
const userName = computed(() => user.value?.fullName || user.value?.username || 'Admin')
const userAvatar = computed(() => user.value?.avatar || 'https://ui-avatars.com/api/?name=' + userName.value + '&background=FF6B6B&color=fff')

const menuSections = [
  {
    title: 'Tổng quan',
    items: [
      { path: '/admin', title: 'Bảng điều khiển', icon: 'fas fa-tachometer-alt' },
    ]
  },
  {
    title: 'Quản lý nội dung',
    items: [
      { path: '/admin/manga', title: 'Quản lý Manga', icon: 'fas fa-book' },
      { path: '/admin/categories', title: 'Quản lý thể loại', icon: 'fas fa-tags' },
    ]
  },
  {
    title: 'Hệ thống',
    items: [
      { path: '/admin/users', title: 'Quản lý người dùng', icon: 'fas fa-users' },
      { path: '/admin/settings', title: 'Cài đặt hệ thống', icon: 'fas fa-cog' },
    ]
  }
]

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  
  // Trường hợp đặc biệt cho trang chapter
  if (path === '/admin/manga' && route.path.includes('/admin/manga/') && route.path.includes('/chapters')) {
    return true
  }
  
  return route.path.startsWith(path)
}

// Hàm xử lý đăng xuất
const handleLogout = async () => {
  try {
    authInstance.logout()
    router.push('/login')
  } catch (error) {
    console.error('Đăng xuất thất bại:', error)
  }
}

// Hàm xử lý chuyển về trang chủ
const handleHomeNavigation = (e: MouseEvent) => {
  e.preventDefault() // Ngăn chặn hành vi mặc định
  
  try {
    // Lấy thông tin người dùng từ AuthService
    const currentUser = authInstance.user
    
    // Đảm bảo có dữ liệu người dùng
    if (!currentUser) {
      console.error('Không tìm thấy thông tin người dùng')
      window.location.href = '/'
      return
    }
    
    // Lưu thông tin người dùng vào localStorage để trang chủ nhận diện
    localStorage.setItem('userFromAdmin', JSON.stringify(currentUser))
    
    // Lưu token hiện tại
    const token = authInstance.token
    if (token) {
      // Lưu token vào localStorage
      localStorage.setItem('token', token)
      
      // Tạo thời gian hết hạn nếu không có
      const tokenExpiry = localStorage.getItem('token_expiry')
      if (!tokenExpiry) {
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 7) // 7 ngày
        localStorage.setItem('token_expiry', expiryDate.toISOString())
      }
      
      // Lưu token_expiry vào biến tạm để trang chủ sử dụng
      localStorage.setItem('token_expiry_temp', localStorage.getItem('token_expiry') || '')
      
      // Lưu thông tin auth vào auth_data
      const authData = {
        token: token,
        refreshToken: '',  // Bạn cần bổ sung refreshToken nếu có
        user: currentUser,
        expiry: localStorage.getItem('token_expiry') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      localStorage.setItem('auth_data', JSON.stringify(authData))
    }
    
    console.log('Chuyển về trang chủ với dữ liệu admin:', currentUser)
    
    // Sử dụng setTimeout để đảm bảo localStorage được cập nhật trước khi chuyển trang
    setTimeout(() => {
      // Sử dụng window.location.href thay vì router.push để đảm bảo tải lại trang hoàn toàn
      window.location.href = '/'
    }, 100)
  } catch (error) {
    console.error('Lỗi khi chuyển về trang chủ:', error)
    window.location.href = '/'
  }
}
</script>

<style scoped>
.text-primary {
  color: #FF6B6B;
}

.border-primary {
  border-color: #FF6B6B;
}

.bg-primary\/20 {
  background-color: rgba(255, 107, 107, 0.2);
}

/* Tùy chỉnh scrollbar */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: #1a202c;
}

::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style> 