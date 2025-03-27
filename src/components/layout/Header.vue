<template>
  <header class="fixed top-0 left-0 right-0 h-header bg-background/95 backdrop-blur-sm z-50">
    <nav class="max-w-container mx-auto px-4 h-full flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-anime text-primary">
        MangaHub
      </router-link>

      <!-- Search Bar -->
      <div class="relative w-[300px]">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm kiếm manga..." 
          class="w-full px-4 py-2 bg-background-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          @keyup.enter="handleSearch"
        >
        <button 
          class="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary"
          @click="handleSearch"
        >
          <i class="i-heroicons-magnifying-glass-20-solid" />
        </button>
      </div>

      <!-- Navigation Menu -->
      <div class="flex items-center gap-6">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="hover:text-primary transition-colors"
        >
          {{ item.label }}
        </router-link>
        <button 
          v-if="!isLoggedIn"
          class="px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          @click="handleLogin"
        >
          Đăng nhập
        </button>
        <div v-else class="relative">
          <button 
            class="flex items-center gap-2 hover:text-primary transition-colors"
            @click="isUserMenuOpen = !isUserMenuOpen"
          >
            <img :src="userAvatar" alt="User avatar" class="w-8 h-8 rounded-full">
            <span>{{ username }}</span>
          </button>
          <!-- User Dropdown Menu -->
          <div 
            v-show="isUserMenuOpen"
            class="absolute right-0 mt-2 w-48 bg-background-light rounded-lg shadow-lg py-2"
          >
            <router-link 
              to="/profile"
              class="block px-4 py-2 hover:bg-background hover:text-primary"
            >
              Hồ sơ
            </router-link>
            <router-link 
              to="/favorites"
              class="block px-4 py-2 hover:bg-background hover:text-primary"
            >
              Yêu thích
            </router-link>
            <button 
              class="w-full text-left px-4 py-2 hover:bg-background hover:text-primary"
              @click="handleLogout"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const isUserMenuOpen = ref(false)

// Mock data - replace with real data later
const isLoggedIn = ref(false)
const username = ref('User')
const userAvatar = ref('/default-avatar.jpg')

const menuItems = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Thể loại', path: '/categories' },
  { label: 'Mới nhất', path: '/latest' },
  { label: 'Yêu thích', path: '/favorites' },
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

const handleLogin = () => {
  router.push('/login')
}

const handleLogout = () => {
  // Add logout logic here
  isLoggedIn.value = false
  router.push('/')
}
</script> 