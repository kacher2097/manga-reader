<template>
  <div class="min-h-screen flex flex-col bg-gray-900 text-white">
    <template v-if="!isReady" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="mb-4">
          <div class="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-lg text-gray-300">Đang tải dữ liệu...</p>
      </div>
    </template>
    
    <template v-else>
      <template v-if="!isAdminRoute">
        <TheHeader :is-authenticated="!!user" :user-avatar="userAvatar" :user-name="userName" />
        <main class="flex-grow">
          <router-view></router-view>
        </main>
        <TheFooter />
        <TheMobileNav 
          v-if="isMobileDevice"
          :is-logged-in="!!user"
          :user-avatar="userAvatar"
          :user-name="userName"
          :user-email="userEmail"
          :categories="categories"
          @logout="handleLogout"
        />
      </template>
      <template v-else>
        <router-view></router-view>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheMobileNav from '@/components/TheMobileNav.vue'

const router = useRouter()
const route = useRoute()
const { user, checkAuth, logout } = useAuth()
const isReady = ref(false)
const isMobileDevice = ref(false)

// Computed properties for user data
const userAvatar = computed(() => user.value?.avatar || 'https://i.pravatar.cc/300')
const userName = computed(() => user.value?.fullName || user.value?.username || 'Người dùng')
const userEmail = computed(() => user.value?.email || '')

// Categories data
const categories = ref([
  { id: 'action', name: 'Action', slug: 'action', count: 1240 },
  { id: 'adventure', name: 'Adventure', slug: 'adventure', count: 980 },
  { id: 'comedy', name: 'Comedy', slug: 'comedy', count: 1560 },
  { id: 'drama', name: 'Drama', slug: 'drama', count: 1120 },
  { id: 'fantasy', name: 'Fantasy', slug: 'fantasy', count: 1340 },
  { id: 'horror', name: 'Horror', slug: 'horror', count: 420 },
  { id: 'romance', name: 'Romance', slug: 'romance', count: 1670 },
  { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi', count: 620 },
  { id: 'slice-of-life', name: 'Slice of Life', slug: 'slice-of-life', count: 920 },
  { id: 'sports', name: 'Sports', slug: 'sports', count: 480 },
  { id: 'supernatural', name: 'Supernatural', slug: 'supernatural', count: 1050 },
  { id: 'mystery', name: 'Mystery', slug: 'mystery', count: 560 },
])

// Kiểm tra xem có đang ở trang admin hay không
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

// Logout function
const handleLogout = async () => {
  await logout()
  router.push('/login')
}

onMounted(async () => {
  // Kiểm tra thiết bị
  isMobileDevice.value = window.innerWidth < 768
  window.addEventListener('resize', () => {
    isMobileDevice.value = window.innerWidth < 768
  })
  
  // Kiểm tra thông tin người dùng đến từ admin
  const userFromAdmin = localStorage.getItem('userFromAdmin')
  const tokenExpiryTemp = localStorage.getItem('token_expiry_temp')
  
  if (userFromAdmin) {
    try {
      // Gán thông tin người dùng từ admin
      user.value = JSON.parse(userFromAdmin)
      
      // Khôi phục thời gian hết hạn token nếu có
      if (tokenExpiryTemp) {
        localStorage.setItem('token_expiry', tokenExpiryTemp)
        localStorage.removeItem('token_expiry_temp')
      }
      
      // Xóa dữ liệu tạm để tránh tác động đến các lần tải trang tiếp theo
      localStorage.removeItem('userFromAdmin')
    } catch (error) {
      console.error('Lỗi khi xử lý thông tin người dùng từ admin:', error)
      await checkAuth()  // Fallback to normal auth check
    }
  } else {
    // Kiểm tra xác thực bình thường nếu không có thông tin từ admin
    await checkAuth()
  }
  
  // Chuyển hướng đến trang admin nếu người dùng là admin và không phải từ trang admin chuyển về
  if (user.value && user.value.role === 'ADMIN' && !userFromAdmin && 
      (route.path === '/' || route.path === '/login')) {
    router.push('/admin')
  }
  
  isReady.value = true
})
</script>

<style>
/* Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.text-primary {
  color: #FF6B6B;
}

.border-primary {
  border-color: #FF6B6B;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
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

/* Global transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Focus styles */
*:focus {
  outline: 2px solid #f56565;
  outline-offset: 2px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
}
</style>
