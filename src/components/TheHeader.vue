<template>
  <header class="bg-gray-900 border-b border-gray-800">
    <!-- Top Navigation -->
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-2">
        <span class="text-2xl font-bold text-red-500">Manga<span class="text-white">Hub</span></span>
      </router-link>

      <!-- Search Bar - Hidden on Mobile -->
      <div class="hidden md:block flex-1 max-w-xl mx-8">
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
                  :src="result.coverImage"
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

      <!-- Desktop Auth Buttons -->
      <div class="hidden md:flex items-center space-x-4">
        <template v-if="props.isAuthenticated">
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
                <div v-if="notifications.length === 0" class="p-3 text-center text-gray-400">
                  Không có thông báo nào
                </div>
              </div>
              <div class="p-2 border-t border-gray-700">
                <router-link 
                  to="/notifications"
                  class="block w-full py-2 text-center text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  @click="showNotifications = false"
                >
                  Xem tất cả thông báo
                </router-link>
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

      <!-- Mobile Menu Button -->
      <button 
        @click="toggleMobileMenu"
        class="md:hidden text-white hover:text-red-500 transition-colors"
      >
        <i :class="['fas', showMobileMenu ? 'fa-times' : 'fa-bars']"></i>
      </button>
    </div>

    <!-- Main Navigation - Desktop -->
    <nav class="hidden md:block bg-gray-800">
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
                  <span class="ml-auto text-xs text-gray-400">({{ String(category.count) }})</span>
                </router-link>
              </div>
            </div>
          </li>
          <li v-if="props.isAuthenticated">
            <router-link 
              to="/favorites" 
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors"
              active-class="text-red-500"
            >
              <i class="fas fa-heart mr-2"></i>
              Yêu thích
            </router-link>
          </li>
          <li v-if="props.isAuthenticated">
            <router-link 
              to="/following" 
              class="block px-4 py-3 text-white hover:text-red-500 transition-colors"
              active-class="text-red-500"
            >
              <i class="fas fa-bookmark mr-2"></i>
              Theo dõi
            </router-link>
          </li>
          <li v-if="props.isAuthenticated">
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

    <!-- Mobile Menu -->
    <div 
      v-if="showMobileMenu"
      class="md:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-95"
    >
      <div class="flex flex-col h-full">
        <!-- Mobile Search -->
        <div class="p-4 border-b border-gray-800">
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
          </div>
        </div>

        <!-- Mobile Navigation -->
        <nav class="flex-1 overflow-y-auto">
          <ul class="py-2">
            <li>
              <router-link 
                to="/" 
                class="block px-6 py-3 text-white hover:bg-gray-800 transition-colors"
                active-class="text-red-500 bg-gray-800"
                @click="closeMobileMenu"
              >
                <i class="fas fa-home mr-3"></i>
                Trang chủ
              </router-link>
            </li>
            <li>
              <router-link 
                to="/latest" 
                class="block px-6 py-3 text-white hover:bg-gray-800 transition-colors"
                active-class="text-red-500 bg-gray-800"
                @click="closeMobileMenu"
              >
                <i class="fas fa-clock mr-3"></i>
                Mới cập nhật
              </router-link>
            </li>
            <li>
              <router-link 
                to="/popular" 
                class="block px-6 py-3 text-white hover:bg-gray-800 transition-colors"
                active-class="text-red-500 bg-gray-800"
                @click="closeMobileMenu"
              >
                <i class="fas fa-fire mr-3"></i>
                Phổ biến
              </router-link>
            </li>
            <li>
              <router-link 
                to="/categories" 
                class="block px-6 py-3 text-white hover:bg-gray-800 transition-colors"
                active-class="text-red-500 bg-gray-800"
                @click="closeMobileMenu"
              >
                <i class="fas fa-tags mr-3"></i>
                Thể loại
              </router-link>
            </li>
            <template v-if="props.isAuthenticated">
              <li>
                <router-link 
                  to="/favorites" 
                  class="block px-6 py-3 text-white hover:bg-gray-800 transition-colors"
                  active-class="text-red-500 bg-gray-800"
                  @click="closeMobileMenu"
                >
                  <i class="fas fa-heart mr-3"></i>
                  Yêu thích
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/history" 
                  class="block px-6 py-3 text-white hover:bg-gray-800 transition-colors"
                  active-class="text-red-500 bg-gray-800"
                  @click="closeMobileMenu"
                >
                  <i class="fas fa-history mr-3"></i>
                  Lịch sử
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/profile" 
                  class="block px-6 py-3 text-white hover:bg-gray-800 transition-colors"
                  active-class="text-red-500 bg-gray-800"
                  @click="closeMobileMenu"
                >
                  <i class="fas fa-user mr-3"></i>
                  Hồ sơ
                </router-link>
              </li>
              <li>
                <button 
                  @click="handleMobileLogout"
                  class="w-full text-left px-6 py-3 text-red-500 hover:bg-gray-800 transition-colors"
                >
                  <i class="fas fa-sign-out-alt mr-3"></i>
                  Đăng xuất
                </button>
              </li>
            </template>
            <template v-else>
              <li>
                <router-link 
                  to="/login" 
                  class="block px-6 py-3 text-white hover:bg-gray-800 transition-colors"
                  @click="closeMobileMenu"
                >
                  <i class="fas fa-sign-in-alt mr-3"></i>
                  Đăng nhập
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/register" 
                  class="block px-6 py-3 text-red-500 hover:bg-gray-800 transition-colors"
                  @click="closeMobileMenu"
                >
                  <i class="fas fa-user-plus mr-3"></i>
                  Đăng ký
                </router-link>
              </li>
            </template>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { Manga, Category, Notification } from '@/types/manga'

// Props từ component cha
const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  userName: {
    type: String,
    default: 'Người dùng'
  },
  userAvatar: {
    type: String,
    default: 'https://i.pravatar.cc/300'
  }
})

const router = useRouter()
const { logout: authLogout } = useAuth()

// States for navigation
const showUserMenu = ref(false)
const showNotifications = ref(false)
const showCategories = ref(false)
const showSearchResults = ref(false)
const showMobileMenu = ref(false)

// Search states
const searchQuery = ref('')
const categorySearch = ref('')
const searchResults = ref<Manga[]>([])

// Computed properties from user state
const userAvatar = computed(() => props.userAvatar || '/default-avatar.png')
const userName = computed(() => props.userName || 'Người dùng')
const isAdmin = computed(() => false)

const unreadNotifications = ref(0)
const notifications = ref<Notification[]>([])

// Categories data
const categories = ref<Category[]>([])

// Filtered categories based on search
const filteredCategories = computed(() => {
  if (!categorySearch.value) return categories.value
  
  const search = categorySearch.value.toLowerCase()
  return categories.value.filter(category => 
    category.name.toLowerCase().includes(search)
  )
})

// Get color for category dot
const getCategoryColor = (id: string | number): string => {
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
  
  const categoryId = String(id)
  return colors[categoryId] || 'bg-gray-400'
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

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
  document.body.style.overflow = ''
}

// Search functions
const handleSearch = async (): Promise<void> => {
  if (searchQuery.value.length > 2) {
    try {
      // Gọi API search manga ở đây
      // const response = await MangaService.search(searchQuery.value)
      // searchResults.value = response.data
      showSearchResults.value = true
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    }
  } else {
    showSearchResults.value = false
  }
}

const clearSearch = (): void => {
  searchQuery.value = ''
  showSearchResults.value = false
  searchResults.value = []
}

// Logout function
const logout = async (): Promise<void> => {
  await authLogout()
  showUserMenu.value = false
  router.push('/login')
}

const handleMobileLogout = async () => {
  await logout()
  closeMobileMenu()
}

// Load initial data
const loadInitialData = async (): Promise<void> => {
  try {
    // Gọi API lấy danh sách thể loại ở đây
    // const response = await CategoryService.getAll()
    // categories.value = response.data
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// Click outside to close dropdowns
const closeDropdowns = (event: MouseEvent): void => {
  const target = event.target as HTMLElement
  
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
  loadInitialData()
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
  document.body.style.overflow = ''
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