<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Bảng điều khiển</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm text-gray-400">Tổng số manga</h2>
            <p class="text-3xl font-semibold">{{ stats.mangaCount }}</p>
          </div>
          <div class="bg-blue-500/20 p-3 rounded-lg">
            <i class="fas fa-book text-blue-400 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm text-gray-400">Tổng số chapter</h2>
            <p class="text-3xl font-semibold">{{ stats.chapterCount }}</p>
          </div>
          <div class="bg-green-500/20 p-3 rounded-lg">
            <i class="fas fa-list-ol text-green-400 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm text-gray-400">Lượt xem</h2>
            <p class="text-3xl font-semibold">{{ formatNumber(stats.totalViews) }}</p>
          </div>
          <div class="bg-yellow-500/20 p-3 rounded-lg">
            <i class="fas fa-eye text-yellow-400 text-xl"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm text-gray-400">Người dùng</h2>
            <p class="text-3xl font-semibold">{{ stats.userCount }}</p>
          </div>
          <div class="bg-red-500/20 p-3 rounded-lg">
            <i class="fas fa-users text-red-400 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Manga -->
      <div class="bg-gray-800 rounded-lg p-6 lg:col-span-2">
        <h2 class="text-xl font-semibold mb-4">Manga mới cập nhật</h2>
        <div class="space-y-4">
          <div v-for="manga in recentMangas" :key="manga.id" class="flex items-center space-x-4 p-3 bg-gray-700/50 rounded-lg">
            <img :src="manga.coverImage" :alt="manga.title" class="w-12 h-16 object-cover rounded">
            <div>
              <h3 class="font-medium">{{ manga.title }}</h3>
              <p class="text-sm text-gray-400">Chapter mới: {{ manga.latestChapter }}</p>
            </div>
            <div class="ml-auto text-sm text-gray-400">
              {{ formatTimeAgo(manga.updatedAt) }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Stats -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Thống kê thể loại</h2>
        <div class="space-y-4">
          <div v-for="category in topCategories" :key="category.id" class="flex items-center">
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span>{{ category.name }}</span>
                <span>{{ category.count }}</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full" :style="{ width: `${category.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Sample data
const stats = ref({
  mangaCount: 325,
  chapterCount: 8573,
  totalViews: 1254789,
  userCount: 12453
})

const recentMangas = ref([
  {
    id: 'one-piece',
    title: 'One Piece',
    coverImage: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    latestChapter: 1089,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/211807.jpg',
    latestChapter: 235,
    updatedAt: Date.now() - 1000 * 60 * 60 * 5 // 5 hours ago
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
    latestChapter: 154,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
  }
])

const topCategories = ref([
  { id: '1', name: 'Action', count: 87, percentage: 80 },
  { id: '2', name: 'Adventure', count: 65, percentage: 60 },
  { id: '3', name: 'Romance', count: 52, percentage: 45 },
  { id: '4', name: 'Fantasy', count: 48, percentage: 40 },
  { id: '5', name: 'Comedy', count: 35, percentage: 30 }
])

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatTimeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) {
    return 'vừa xong'
  }
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} phút trước`
  }
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} giờ trước`
  }
  
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}
</script>

<style scoped>
.text-primary {
  color: #FF6B6B;
}

.bg-primary {
  background-color: #FF6B6B;
}
</style> 