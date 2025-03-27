<template>
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
            @click="handleLogout"
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  isLoggedIn: boolean
  userAvatar: string
  userName: string
  userEmail: string
  categories: Array<{id: string, name: string, count: number}>
}>()

const emit = defineEmits(['logout'])

const router = useRouter()
const showMobileMenu = ref(false)
const mobileExpandCategories = ref(false)
const mobileSearchQuery = ref('')

// Top categories for mobile menu
const topCategories = computed(() => {
  return [...props.categories]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

const handleMobileSearch = (): void => {
  if (mobileSearchQuery.value.length > 0) {
    router.push({ path: '/search', query: { q: mobileSearchQuery.value } })
    showMobileMenu.value = false
  }
}

const handleLogout = (): void => {
  emit('logout')
  showMobileMenu.value = false
}
</script>

<style scoped>
/* Mobile navigation styles */
</style> 