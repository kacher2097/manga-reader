<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <TheHeader />
    <main class="container mx-auto px-4 py-6 mb-16 lg:mb-0">
      <router-view v-if="isReady" />
      <div v-else class="loading">
        <span>Đang tải...</span>
      </div>
    </main>
    <TheMobileNav 
      :is-logged-in="isLoggedIn"
      :user-avatar="userAvatar"
      :user-name="userName"
      :user-email="userEmail"
      :categories="categories"
      @logout="handleLogout"
    />
    <TheFooter />
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import TheMobileNav from './components/TheMobileNav.vue'
import ScrollToTop from './components/ScrollToTop.vue'
import { AuthService } from './services/auth.service'

// Mock user data
const isLoggedIn = ref(false)
const userAvatar = ref('https://i.pravatar.cc/300')
const userName = ref('John Doe')
const userEmail = ref('user@example.com')

// Categories data
const categories = ref([
  { id: 'action', name: 'Action', count: 1240 },
  { id: 'adventure', name: 'Adventure', count: 980 },
  { id: 'comedy', name: 'Comedy', count: 1560 },
  { id: 'drama', name: 'Drama', count: 1120 },
  { id: 'fantasy', name: 'Fantasy', count: 1340 },
  { id: 'horror', name: 'Horror', count: 420 },
  { id: 'romance', name: 'Romance', count: 1670 },
  { id: 'sci-fi', name: 'Sci-Fi', count: 620 },
  { id: 'slice-of-life', name: 'Slice of Life', count: 920 },
  { id: 'sports', name: 'Sports', count: 480 },
  { id: 'supernatural', name: 'Supernatural', count: 1050 },
  { id: 'mystery', name: 'Mystery', count: 560 },
])

const isReady = ref(false)

onMounted(async () => {
  // Khôi phục trạng thái authentication từ localStorage
  const token = AuthService.getToken()
  if (token) {
    try {
      await AuthService.getCurrentUser()
    } catch (error) {
      AuthService.logout()
    }
  }
  isReady.value = true
})

// Logout function
const handleLogout = (): void => {
  isLoggedIn.value = false
  // Handle logout logic
}
</script>

<style>
/* Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
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
