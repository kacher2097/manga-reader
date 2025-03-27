<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <!-- Error Icon -->
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/20 text-red-500">
          <i class="fas fa-exclamation-triangle text-5xl"></i>
        </div>
      </div>

      <!-- Error Message -->
      <h1 class="text-6xl font-bold text-white mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-white mb-6">Trang không tồn tại</h2>
      <p class="text-gray-400 mb-8">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/"
          class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <i class="fas fa-home mr-2"></i>
          Trang chủ
        </router-link>
        <button
          @click="goBack"
          class="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Quay lại
        </button>
      </div>

      <!-- Popular Manga -->
      <div class="mt-16">
        <h3 class="text-xl font-semibold text-white mb-6">Có thể bạn quan tâm</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <router-link
            v-for="manga in popularManga"
            :key="manga.id"
            :to="`/manga/${manga.id}`"
            class="block group"
          >
            <div class="aspect-[3/4] rounded-lg overflow-hidden mb-2">
              <img
                :src="manga.cover"
                :alt="manga.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h4 class="text-white text-sm font-medium truncate group-hover:text-red-500 transition-colors duration-200">
              {{ manga.title }}
            </h4>
          </router-link>
        </div>
      </div>

      <!-- Search -->
      <div class="mt-12">
        <h3 class="text-xl font-semibold text-white mb-4">Tìm kiếm manga</h3>
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Nhập tên manga cần tìm..."
            class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pr-10 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            @keyup.enter="search"
          />
          <button
            @click="search"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

// Mock data
const popularManga = [
  {
    id: '1',
    title: 'One Piece',
    cover: 'https://example.com/images/manga/one-piece.jpg'
  },
  {
    id: '2',
    title: 'Naruto',
    cover: 'https://example.com/images/manga/naruto.jpg'
  },
  {
    id: '3',
    title: 'Dragon Ball',
    cover: 'https://example.com/images/manga/dragon-ball.jpg'
  }
]

// Go back to previous page
const goBack = () => {
  window.history.length > 1 ? router.go(-1) : router.push('/')
}

// Search
const search = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value }
    })
  }
}
</script> 