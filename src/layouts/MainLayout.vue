`<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50">
        <nav class="container mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <router-link to="/" class="flex items-center space-x-2">
              <span class="text-2xl font-bold text-red-500">Manga<span class="text-gray-700 dark:text-white">Hub</span></span>
            </router-link>
  
            <!-- Search Bar - Hide on mobile -->
            <div class="hidden md:flex flex-1 max-w-xl mx-8">
              <div class="relative w-full">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Tìm kiếm manga..."
                  class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  @keyup.enter="handleSearch"
                />
                <button 
                  class="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 transition-colors"
                  @click="handleSearch"
                >
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
  
            <!-- Navigation -->
            <div class="flex items-center space-x-4">
              <!-- Mobile Search Button -->
              <button 
                class="md:hidden text-gray-600 dark:text-gray-300 hover:text-red-500"
                @click="showMobileSearch = !showMobileSearch"
              >
                <i class="fas fa-search"></i>
              </button>
  
              <!-- Theme Toggle -->
              <button 
                class="text-gray-600 dark:text-gray-300 hover:text-red-500"
                @click="toggleTheme"
              >
                <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
              </button>
  
              <!-- User Menu -->
              <div class="relative" v-if="isAuthenticated">
                <button 
                  class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
                  @click="showUserMenu = !showUserMenu"
                >
                  <img 
                    :src="user.avatar || '/images/default-avatar.png'" 
                    alt="User avatar"
                    class="w-8 h-8 rounded-full object-cover"
                  />
                  <span class="hidden md:inline">{{ user.username }}</span>
                  <i class="fas fa-chevron-down text-xs"></i>
                </button>
  
                <!-- Dropdown Menu -->
                <div 
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2"
                >
                  <router-link
                    v-for="item in userMenuItems"
                    :key="item.path"
                    :to="item.path"
                    class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="showUserMenu = false"
                  >
                    <i :class="item.icon" class="w-5"></i>
                    <span class="ml-2">{{ item.name }}</span>
                  </router-link>
                  <button
                    class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="handleLogout"
                  >
                    <i class="fas fa-sign-out-alt w-5"></i>
                    <span class="ml-2">Đăng xuất</span>
                  </button>
                </div>
              </div>
  
              <!-- Auth Buttons -->
              <template v-else>
                <router-link
                  to="/login"
                  class="hidden md:block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
                >
                  Đăng nhập
                </router-link>
                <router-link
                  to="/register"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Đăng ký
                </router-link>
              </template>
            </div>
          </div>
  
          <!-- Mobile Search Bar -->
          <div 
            v-if="showMobileSearch"
            class="md:hidden mt-3"
          >
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm manga..."
                class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                @keyup.enter="handleSearch"
              />
              <button 
                class="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 transition-colors"
                @click="handleSearch"
              >
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </nav>
  
        <!-- Main Navigation -->
        <div class="bg-red-500">
          <nav class="container mx-auto px-4">
            <div class="flex items-center space-x-6 overflow-x-auto py-2 scrollbar-none">
              <router-link
                v-for="item in mainNavItems"
                :key="item.path"
                :to="item.path"
                class="text-white hover:text-gray-200 whitespace-nowrap transition-colors"
              >
                {{ item.name }}
              </router-link>
            </div>
          </nav>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="container mx-auto px-4 pt-32 pb-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
  
      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 shadow-lg mt-auto">
        <div class="container mx-auto px-4 py-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">Về MangaHub</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Trang web đọc truyện manga online lớn nhất Việt Nam, cập nhật nhanh nhất và đầy đủ nhất.
              </p>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">Liên kết</h3>
              <ul class="space-y-2">
                <li>
                  <router-link to="/terms" class="text-gray-600 dark:text-gray-300 hover:text-red-500">
                    Điều khoản sử dụng
                  </router-link>
                </li>
                <li>
                  <router-link to="/privacy" class="text-gray-600 dark:text-gray-300 hover:text-red-500">
                    Chính sách bảo mật
                  </router-link>
                </li>
                <li>
                  <router-link to="/dmca" class="text-gray-600 dark:text-gray-300 hover:text-red-500">
                    DMCA
                  </router-link>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">Thể loại</h3>
              <ul class="space-y-2">
                <li v-for="category in popularCategories" :key="category.id">
                  <router-link 
                    :to="'/category/' + category.id" 
                    class="text-gray-600 dark:text-gray-300 hover:text-red-500"
                  >
                    {{ category.name }}
                  </router-link>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">Theo dõi chúng tôi</h3>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-red-500">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-red-500">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-red-500">
                  <i class="fab fa-discord"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-300">
            <p>&copy; 2024 MangaHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  // State
  const searchQuery = ref('')
  const showMobileSearch = ref(false)
  const showUserMenu = ref(false)
  const isDark = ref(false)
  const isAuthenticated = ref(false)
  
  // Mock user data
  const user = ref({
    username: 'JohnDoe',
    avatar: '/images/default-avatar.png'
  })
  
  // Navigation items
  const mainNavItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Mới cập nhật', path: '/latest' },
    { name: 'Phổ biến', path: '/popular' },
    { name: 'Thể loại', path: '/categories' },
    { name: 'Xếp hạng', path: '/rankings' },
    { name: 'Theo dõi', path: '/following' },
    { name: 'Lịch sử', path: '/history' },
  ]
  
  const userMenuItems = [
    { name: 'Hồ sơ', path: '/profile', icon: 'fas fa-user' },
    { name: 'Theo dõi', path: '/following', icon: 'fas fa-heart' },
    { name: 'Lịch sử', path: '/history', icon: 'fas fa-history' },
    { name: 'Cài đặt', path: '/settings', icon: 'fas fa-cog' },
  ]
  
  const popularCategories = [
    { id: 'action', name: 'Action' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'romance', name: 'Romance' },
    { id: 'fantasy', name: 'Fantasy' },
  ]
  
  // Router
  const router = useRouter()
  
  // Methods
  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      router.push({
        path: '/search',
        query: { q: searchQuery.value }
      })
      showMobileSearch.value = false
    }
  }
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark')
  }
  
  const handleLogout = () => {
    isAuthenticated.value = false
    showUserMenu.value = false
    router.push('/login')
  }
  
  // Lifecycle
  onMounted(() => {
    // Check system theme preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    }
  
    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (!target.closest('.user-menu')) {
        showUserMenu.value = false
      }
    })
  })
  </script>
  
  <style scoped>
  .scrollbar-none {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>`