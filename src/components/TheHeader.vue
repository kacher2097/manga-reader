<template>
  <header class="bg-gray-900 border-b border-gray-800">
    <!-- Top Navigation -->
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-2">
        <span class="text-2xl font-bold text-red-500">Manga<span class="text-white">Hub</span></span>
      </router-link>

      <!-- Search Bar -->
      <div class="flex-1 max-w-xl mx-8">
        <div class="relative">
          <input 
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Tìm kiếm manga..."
            class="w-full px-4 py-2 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button class="absolute right-3 top-1/2 -translate-y-1/2">
            <i class="fas fa-search text-gray-400"></i>
          </button>

          <!-- Search Results -->
          <div 
            v-if="showSearchResults && searchResults.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div class="max-h-96 overflow-y-auto">
              <router-link
                v-for="result in searchResults"
                :key="result.id"
                :to="`/manga/${result.id}`"
                class="flex items-center p-3 hover:bg-gray-700 transition-colors"
                @click="clearSearch"
              >
                <img 
                  :src="result.cover"
                  :alt="result.title"
                  class="w-12 h-16 object-cover rounded"
                />
                <div class="ml-3">
                  <h4 class="text-white font-medium">{{ result.title }}</h4>
                  <p class="text-sm text-gray-400">{{ result.latestChapter }} chapters</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Auth Buttons -->
      <div class="flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <!-- Notifications -->
          <div class="relative notifications">
            <button 
              @click="toggleNotifications"
              class="text-white hover:text-red-500 transition-colors relative"
            >
              <i class="fas fa-bell"></i>
              <span 
                v-if="unreadNotifications > 0"
                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center"
              >
                {{ unreadNotifications }}
              </span>
            </button>

            <!-- Notifications Dropdown -->
            <div 
              v-if="showNotifications"
              class="absolute top-full right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
            >
              <div class="p-3 border-b border-gray-700">
                <h3 class="text-white font-medium">Thông báo</h3>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <div 
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
                >
                  <p class="text-white">{{ notification.message }}</p>
                  <span class="text-sm text-gray-400">{{ notification.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="relative user-menu">
            <button 
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-white hover:text-red-500 transition-colors"
            >
              <img 
                :src="userAvatar"
                alt="User avatar"
                class="w-8 h-8 rounded-full object-cover"
              />
              <span>{{ userName }}</span>
              <i class="fas fa-chevron-down"></i>
            </button>

            <!-- User Dropdown -->
            <div 
              v-if="showUserMenu"
              class="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
            >
              <router-link 
                to="/profile"
                class="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-user mr-2"></i>
                Hồ sơ
              </router-link>
              <router-link 
                to="/favorites"
                class="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-heart mr-2"></i>
                Yêu thích
              </router-link>
              <router-link 
                to="/following"
                class="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-bookmark mr-2"></i>
                Theo dõi
              </router-link>
              <router-link 
                to="/history"
                class="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-history mr-2"></i>
                Lịch sử
              </router-link>
              <router-link 
                to="/settings"
                class="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-cog mr-2"></i>
                Cài đặt
              </router-link>
              <button 
                @click="logout"
                class="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-sign-out-alt mr-2"></i>
                Đăng xuất
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link 
            to="/login"
            class="text-white hover:text-red-500 transition-colors"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>
            Đăng nhập
          </router-link>
          <router-link 
            to="/register"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            <i class="fas fa-user-plus mr-2"></i>
            Đăng ký
          </router-link>
        </template>
      </div>
    </div>

    <!-- Main Navigation -->
    <nav class="bg-gray-800">
      <div class="container mx-auto px-4">
        <ul class="flex">
          <li>
            <router-link 
              to="/" 
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors"
              active-class="text-red-500"
            >
              <i class="fas fa-home mr-2"></i>
              Trang chủ
            </router-link>
          </li>
          <li>
            <router-link 
              to="/continue" 
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors"
              active-class="text-red-500"
            >
              <i class="fas fa-book-reader mr-2"></i>
              Đọc tiếp
            </router-link>
          </li>
          <li>
            <router-link 
              to="/latest" 
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors"
              active-class="text-red-500"
            >
              <i class="fas fa-clock mr-2"></i>
              Mới cập nhật
            </router-link>
          </li>
          <li>
            <router-link 
              to="/popular" 
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors"
              active-class="text-red-500"
            >
              <i class="fas fa-fire mr-2"></i>
              Phổ biến
            </router-link>
          </li>
          <li class="relative categories">
            <button 
              @click="toggleCategories"
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors"
              :class="{ 'text-red-500': $route.path.includes('/category') || $route.path === '/categories' }"
            >
              <i class="fas fa-tags mr-2"></i>
              Thể loại
              <i class="fas fa-chevron-down ml-2"></i>
            </button>

            <!-- Categories Dropdown -->
            <div 
              v-if="showCategories"
              class="absolute top-full left-0 mt-1 w-72 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
            >
              <div class="p-2 border-b border-gray-700">
                <div class="px-2 pb-2">
                  <input
                    v-model="categorySearch"
                    type="text"
                    placeholder="Tìm thể loại..."
                    class="w-full px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <router-link
                  to="/categories"
                  class="block p-2 text-white hover:text-red-500 hover:bg-gray-700 rounded transition-colors"
                >
                  <i class="fas fa-th-large mr-2"></i>
                  Xem tất cả thể loại
                </router-link>
              </div>
              <div class="grid grid-cols-2 gap-2 p-4 max-h-96 overflow-y-auto">
                <router-link
                  v-for="category in filteredCategories"
                  :key="category.id"
                  :to="`/category/${category.id}`"
                  class="flex items-center text-white hover:text-red-500 transition-colors p-1.5"
                >
                  <span :class="`w-2 h-2 rounded-full mr-2 ${getCategoryColor(category.id)}`"></span>
                  <span>{{ category.name }}</span>
                  <span class="ml-auto text-xs text-gray-400">({{ category.count }})</span>
                </router-link>
              </div>
            </div>
          </li>
          <li v-if="isLoggedIn">
            <router-link 
              to="/favorites" 
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors"
              active-class="text-red-500"
            >
              <i class="fas fa-heart mr-2"></i>
              Yêu thích
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link 
              to="/following" 
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors"
              active-class="text-red-500"
            >
              <i class="fas fa-bookmark mr-2"></i>
              Theo dõi
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link 
              to="/history" 
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors"
              active-class="text-red-500"
            >
              <i class="fas fa-history mr-2"></i>
              Lịch sử
            </router-link>
          </li>
          <li>
            <router-link 
              to="/search" 
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors md:hidden"
              active-class="text-red-500"
            >
              <i class="fas fa-search mr-2"></i>
              Tìm kiếm
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// States for navigation
const showUserMenu = ref(false)
const showNotifications = ref(false)
const showCategories = ref(false)
const showSearchResults = ref(false)

// Search states
const searchQuery = ref('')
const categorySearch = ref('')
const searchResults = ref([
  { id: '1', title: 'One Piece', cover: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg', latestChapter: 1089 },
  { id: '2', title: 'Jujutsu Kaisen', cover: 'https://cdn.myanimelist.net/images/manga/3/211807.jpg', latestChapter: 219 },
  { id: '3', title: 'Chainsaw Man', cover: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg', latestChapter: 130 },
])

// Mock user data
const isLoggedIn = ref(false)
const userAvatar = ref('https://i.pravatar.cc/300')
const userName = ref('John Doe')
const unreadNotifications = ref(3)
const notifications = ref([
  { id: 1, message: 'One Piece Chapter 1089 đã được cập nhật', time: '5 phút trước' },
  { id: 2, message: 'Jujutsu Kaisen Chapter 253 đã được cập nhật', time: '1 giờ trước' },
  { id: 3, message: 'New manga added to your favorites', time: '1 day ago' },
])

// Categories data
const categories = ref([
  { id: 'action', name: 'Action', count: 1240 },
  { id: 'adventure', name: 'Adventure', count: 980 },
  { id: 'comedy', name: 'Comedy', count: 1560 },
  { id: 'drama', name: 'Drama', count: 1120 },
  { id: 'ecchi', name: 'Ecchi', count: 670 },
  { id: 'fantasy', name: 'Fantasy', count: 1340 },
  { id: 'horror', name: 'Horror', count: 420 },
  { id: 'josei', name: 'Josei', count: 180 },
  { id: 'magic', name: 'Magic', count: 780 },
  { id: 'mecha', name: 'Mecha', count: 310 },
  { id: 'mystery', name: 'Mystery', count: 560 },
  { id: 'psychological', name: 'Psychological', count: 430 },
  { id: 'romance', name: 'Romance', count: 1670 },
  { id: 'school-life', name: 'School Life', count: 890 },
  { id: 'sci-fi', name: 'Sci-Fi', count: 620 },
  { id: 'seinen', name: 'Seinen', count: 850 },
  { id: 'shoujo', name: 'Shoujo', count: 750 },
  { id: 'shounen', name: 'Shounen', count: 1930 },
  { id: 'slice-of-life', name: 'Slice of Life', count: 920 },
  { id: 'sports', name: 'Sports', count: 480 },
  { id: 'supernatural', name: 'Supernatural', count: 1050 },
  { id: 'tragedy', name: 'Tragedy', count: 370 },
])

// Filtered categories based on search
const filteredCategories = computed(() => {
  if (!categorySearch.value) return categories.value
  
  const search = categorySearch.value.toLowerCase()
  return categories.value.filter(category => 
    category.name.toLowerCase().includes(search)
  )
})

// Get color for category dot
const getCategoryColor = (id: string): string => {
  const colors: Record<string, string> = {
    'action': 'bg-red-500',
    'adventure': 'bg-blue-500',
    'comedy': 'bg-yellow-500',
    'drama': 'bg-purple-500',
    'fantasy': 'bg-green-500',
    'horror': 'bg-gray-500',
    'romance': 'bg-pink-500',
    'sci-fi': 'bg-indigo-500'
  }
  
  return colors[id] || 'bg-gray-400'
}

// Toggle functions
const toggleUserMenu = (): void => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
  showCategories.value = false
}

const toggleNotifications = (): void => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
  showCategories.value = false
}

const toggleCategories = (): void => {
  showCategories.value = !showCategories.value
  showUserMenu.value = false
  showNotifications.value = false
}

// Search functions
const handleSearch = (): void => {
  if (searchQuery.value.length > 2) {
    // In a real app, you would fetch search results here
    showSearchResults.value = true
  } else {
    showSearchResults.value = false
  }
}

const clearSearch = (): void => {
  searchQuery.value = ''
  showSearchResults.value = false
}

// Logout function
const logout = (): void => {
  isLoggedIn.value = false
  showUserMenu.value = false
  // In a real app, you would handle logout logic here
}

// Click outside to close dropdowns
const closeDropdowns = (event: MouseEvent): void => {
  const target = event.target as HTMLElement
  
  // Check if click is outside user menu
  if (showUserMenu.value && !target.closest('.user-menu')) {
    showUserMenu.value = false
  }
  
  // Check if click is outside notifications
  if (showNotifications.value && !target.closest('.notifications')) {
    showNotifications.value = false
  }
  
  // Check if click is outside categories
  if (showCategories.value && !target.closest('.categories')) {
    showCategories.value = false
  }
  
  // Check if click is outside search results
  if (showSearchResults.value && !target.closest('.search-container')) {
    showSearchResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>

<style scoped>
.router-link-active {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Hide scrollbar */
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style> 