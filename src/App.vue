<template>
  <div class="min-h-screen flex flex-col bg-gray-900 text-white">
    <template v-if="!isReady">
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="mb-4">
            <div class="inline-block w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p class="text-lg text-gray-300">Đang tải dữ liệu...</p>
        </div>
      </div>
    </template>
    
    <template v-else>
      <template v-if="!isAdminRoute">
        <TheHeader />
        <main class="flex-grow">
          <router-view></router-view>
        </main>
        <TheFooter />
        <TheMobileNav 
          v-if="isMobileDevice"
          :is-logged-in="auth.isAuthenticated()"
          :user-avatar="auth.user?.avatar || 'https://i.pravatar.cc/300'"
          :user-name="auth.user?.fullName || auth.user?.username || 'Người dùng'"
          :user-email="auth.user?.email || ''"
          :categories="categories"
          @logout="auth.logout"
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
const auth = useAuth()
const isReady = ref(false)
const isMobileDevice = ref(false)

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

onMounted(async () => {
  // Kiểm tra thiết bị
  isMobileDevice.value = window.innerWidth < 768
  window.addEventListener('resize', () => {
    isMobileDevice.value = window.innerWidth < 768
  })
  
  try {
    // Kiểm tra xác thực người dùng
    await auth.getCurrentUser()
    
    // Chuyển hướng nếu người dùng là admin
    if (auth.isAdmin()  && (route.path === '/' || route.path === '/login')) {
      router.push('/admin')
    }
  } catch (error) {
    console.error('Error during authentication check:', error)
  } finally {
    // Đã sẵn sàng hiển thị UI
    isReady.value = true
  }
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
