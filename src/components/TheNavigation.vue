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
          <div class="relative">
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
          <div class="relative">
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
          <li class="relative">
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
              class="absolute top-full left-0 mt-1 w-[800px] bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
            >
              <div class="p-6 border-b border-gray-700">
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-semibold text-white">Thể loại</h3>
                  <router-link
                    to="/categories"
                    class="text-red-500 hover:text-red-400 text-sm font-medium"
                  >
                    Xem tất cả
                  </router-link>
                </div>
                <div class="mt-4 relative">
                  <input
                    v-model="categorySearch"
                    type="text"
                    placeholder="Tìm thể loại..."
                    class="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                  />
                  <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              <div class="p-6 max-h-[500px] overflow-y-auto">
                <div class="grid grid-cols-3 gap-6">
                  <router-link
                    v-for="category in filteredCategories"
                    :key="category.id"
                    :to="`/category/${category.id}`"
                    class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 transition-colors group"
                    @click="showCategories = false"
                  >
                    <span 
                      :class="[
                        'w-4 h-4 rounded-full',
                        getCategoryColor(category.id)
                      ]"
                    ></span>
                    <div>
                      <span class="text-white text-lg group-hover:text-red-500 transition-colors">{{ category.name }}</span>
                      <span class="text-gray-400 text-sm ml-2">({{ category.count }})</span>
                    </div>
                  </router-link>
                </div>
              </div>
              <div class="p-6 bg-gray-900/50 border-t border-gray-700">
                <div class="text-sm text-gray-400">
                  Thể loại phổ biến:
                  <div class="mt-3 flex flex-wrap gap-3">
                    <router-link
                      v-for="category in topCategories.slice(0, 5)"
                      :key="category.id"
                      :to="`/category/${category.id}`"
                      class="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-red-500 transition-colors text-sm"
                      @click="showCategories = false"
                    >
                      {{ category.name }}
                    </router-link>
                  </div>
                </div>
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
  <!-- Mobile Navigation Drawer -->
  <div 
    class="fixed inset-0 bg-gray-900/80 z-50 lg:hidden"
    v-if="showMobileMenu"
    @click="showMobileMenu = false"
  ></div>

  <div
    class="fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 transform transition-transform duration-300 lg:hidden"
    :class="{ 'translate-x-0': showMobileMenu, '-translate-x-full': !showMobileMenu }"
  >
    <div class="flex items-center justify-between p-4 border-b border-gray-800">
      <router-link @click="showMobileMenu = false" to="/" class="flex items-center space-x-2">
        <span class="text-xl font-bold text-red-500">Manga<span class="text-white">Hub</span></span>
      </router-link>
      <button @click="showMobileMenu = false" class="text-gray-400 hover:text-white">
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>

    <div class="p-4 overflow-y-auto">
      <div class="mb-4">
        <div class="relative">
          <input 
            type="text"
            v-model="mobileSearchQuery"
            placeholder="Tìm kiếm manga..."
            class="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button @click="handleMobileSearch" class="absolute right-3 top-1/2 -translate-y-1/2">
            <i class="fas fa-search text-gray-400"></i>
          </button>
        </div>
      </div>

      <ul class="space-y-1">
        <li>
          <router-link 
            @click="showMobileMenu = false"
            to="/" 
            class="flex items-center px-4 py-3 text-white hover:bg-gray-800 rounded-lg"
            active-class="bg-gray-800 text-red-500"
          >
            <i class="fas fa-home w-6"></i>
            <span>Trang chủ</span>
          </router-link>
        </li>
        <li>
          <router-link 
            @click="showMobileMenu = false"
            to="/continue" 
            class="flex items-center px-4 py-3 text-white hover:bg-gray-800 rounded-lg"
            active-class="bg-gray-800 text-red-500"
          >
            <i class="fas fa-book-reader w-6"></i>
            <span>Đọc tiếp</span>
          </router-link>
        </li>
        <li>
          <router-link 
            @click="showMobileMenu = false"
            to="/latest" 
            class="flex items-center px-4 py-3 text-white hover:bg-gray-800 rounded-lg"
            active-class="bg-gray-800 text-red-500"
          >
            <i class="fas fa-clock w-6"></i>
            <span>Mới cập nhật</span>
          </router-link>
        </li>
        <li>
          <router-link 
            @click="showMobileMenu = false"
            to="/popular" 
            class="flex items-center px-4 py-3 text-white hover:bg-gray-800 rounded-lg"
            active-class="bg-gray-800 text-red-500"
          >
            <i class="fas fa-fire w-6"></i>
            <span>Phổ biến</span>
          </router-link>
        </li>
        <li>
          <button
            @click="mobileExpandCategories = !mobileExpandCategories"
            class="flex items-center justify-between w-full px-4 py-3 text-white hover:bg-gray-800 rounded-lg"
            :class="{ 'bg-gray-800': mobileExpandCategories }"
          >
            <div class="flex items-center">
              <i class="fas fa-tags w-6"></i>
              <span>Thể loại</span>
            </div>
            <i :class="['fas', mobileExpandCategories ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>
          <div v-if="mobileExpandCategories" class="ml-8 mt-2 space-y-1">
            <router-link
              @click="showMobileMenu = false"
              to="/categories"
              class="block py-2 px-4 text-white hover:text-red-500"
            >
              Tất cả thể loại
            </router-link>
            <router-link
              v-for="category in topCategories"
              :key="category.id"
              :to="`/category/${category.id}`"
              @click="showMobileMenu = false"
              class="block py-2 px-4 text-white hover:text-red-500"
            >
              {{ category.name }}
            </router-link>
          </div>
        </li>
        <li v-if="isLoggedIn">
          <router-link 
            @click="showMobileMenu = false"
            to="/favorites" 
            class="flex items-center px-4 py-3 text-white hover:bg-gray-800 rounded-lg"
            active-class="bg-gray-800 text-red-500"
          >
            <i class="fas fa-heart w-6"></i>
            <span>Yêu thích</span>
          </router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link 
            @click="showMobileMenu = false"
            to="/history" 
            class="flex items-center px-4 py-3 text-white hover:bg-gray-800 rounded-lg"
            active-class="bg-gray-800 text-red-500"
          >
            <i class="fas fa-history w-6"></i>
            <span>Lịch sử</span>
          </router-link>
        </li>
      </ul>

      <div class="mt-6 pt-6 border-t border-gray-800">
        <div v-if="isLoggedIn" class="space-y-3">
          <div class="flex items-center px-4 py-2">
            <img 
              :src="userAvatar"
              alt="User avatar"
              class="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <p class="text-white font-medium">{{ userName }}</p>
              <p class="text-gray-400 text-sm">{{ userEmail }}</p>
            </div>
          </div>
          <router-link
            @click="showMobileMenu = false"
            to="/profile"
            class="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
          >
            <i class="fas fa-user w-6"></i>
            <span>Hồ sơ</span>
          </router-link>
          <router-link
            @click="showMobileMenu = false"
            to="/settings"
            class="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
          >
            <i class="fas fa-cog w-6"></i>
            <span>Cài đặt</span>
          </router-link>
          <button
            @click="logout(); showMobileMenu = false"
            class="flex items-center w-full px-4 py-2 text-red-500 hover:bg-gray-800 rounded-lg"
          >
            <i class="fas fa-sign-out-alt w-6"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
        <div v-else class="flex flex-col space-y-3">
          <router-link
            @click="showMobileMenu = false"
            to="/login"
            class="flex items-center justify-center px-4 py-2 text-white border border-gray-700 rounded-lg hover:bg-gray-800"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>
            <span>Đăng nhập</span>
          </router-link>
          <router-link
            @click="showMobileMenu = false"
            to="/register"
            class="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <i class="fas fa-user-plus mr-2"></i>
            <span>Đăng ký</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Bottom Navigation -->
  <div class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 lg:hidden z-40">
    <div class="flex justify-between">
      <router-link 
        to="/" 
        class="flex flex-col items-center flex-1 py-3 text-gray-400"
        active-class="text-red-500"
      >
        <i class="fas fa-home mb-1"></i>
        <span class="text-xs">Trang chủ</span>
      </router-link>
      <router-link 
        to="/search" 
        class="flex flex-col items-center flex-1 py-3 text-gray-400"
        active-class="text-red-500"
      >
        <i class="fas fa-search mb-1"></i>
        <span class="text-xs">Tìm kiếm</span>
      </router-link>
      <router-link 
        to="/categories" 
        class="flex flex-col items-center flex-1 py-3 text-gray-400"
        active-class="text-red-500"
      >
        <i class="fas fa-tags mb-1"></i>
        <span class="text-xs">Thể loại</span>
      </router-link>
      <router-link 
        to="/latest" 
        class="flex flex-col items-center flex-1 py-3 text-gray-400"
        active-class="text-red-500"
      >
        <i class="fas fa-clock mb-1"></i>
        <span class="text-xs">Mới nhất</span>
      </router-link>
      <button
        @click="showMobileMenu = true"
        class="flex flex-col items-center flex-1 py-3 text-gray-400"
      >
        <i class="fas fa-bars mb-1"></i>
        <span class="text-xs">Menu</span>
      </button>
    </div>
  </div>

  <!-- Scroll to Top Button -->
  <button
    v-show="showScrollTop"
    @click="scrollToTop"
    class="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40 transition-all duration-300"
  >
    <i class="fas fa-arrow-up"></i>
  </button>
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
const showMobileMenu = ref(false)
const mobileExpandCategories = ref(false)
const showScrollTop = ref(false)

// Search states
const searchQuery = ref('')
const mobileSearchQuery = ref('')
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
const userEmail = ref('user@example.com')
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

// Top categories for mobile menu
const topCategories = computed(() => {
  return [...categories.value]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

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

const handleMobileSearch = (): void => {
  if (mobileSearchQuery.value.length > 0) {
    router.push({ path: '/search', query: { q: mobileSearchQuery.value } })
    showMobileMenu.value = false
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

// Scroll to top functionality
const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Check scroll position to show/hide scroll to top button and close dropdowns
const checkScroll = (): void => {
  showScrollTop.value = window.scrollY > 500
  // Close all dropdowns when scrolling
  showCategories.value = false
  showUserMenu.value = false
  showNotifications.value = false
  showSearchResults.value = false
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
  window.addEventListener('scroll', checkScroll)
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
  document.removeEventListener('click', closeDropdowns)
})
</script>

<style scoped>
.router-link-active {
  background-color: rgba(0, 0, 0, 0.1);
}
.user-menu,
.notifications,
.categories,
.search-container {
  position: relative;
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