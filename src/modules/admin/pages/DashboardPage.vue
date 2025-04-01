<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gray-800 rounded-lg p-5 shadow-md border border-gray-700">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-primary">Bảng điều khiển</h1>
          <p class="text-gray-400 mt-1">Xem tổng quan hoạt động của hệ thống</p>
        </div>
        <div class="flex space-x-2">
          <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center transition-colors">
            <i class="fas fa-sync-alt mr-2"></i> Cập nhật
          </button>
        </div>
      </div>
    </div>
    
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Manga -->
      <div class="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-md p-5 border border-blue-700/50 hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-gray-300 font-medium">Tổng Manga</div>
            <div class="text-3xl font-bold text-white mt-2">{{ stats.totalManga }}</div>
            <div class="text-blue-300 text-sm mt-1 flex items-center">
              <i class="fas fa-arrow-up mr-1.5"></i> 
              <span>{{ stats.newMangaPercent }}% từ tháng trước</span>
            </div>
          </div>
          <div class="bg-blue-700/30 p-3 rounded-lg">
            <i class="fas fa-book text-blue-300 text-2xl"></i>
          </div>
        </div>
      </div>
      
      <!-- Total Chapters -->
      <div class="bg-gradient-to-br from-green-900 to-green-800 rounded-lg shadow-md p-5 border border-green-700/50 hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-gray-300 font-medium">Tổng Chapters</div>
            <div class="text-3xl font-bold text-white mt-2">{{ stats.totalChapters }}</div>
            <div class="text-green-300 text-sm mt-1 flex items-center">
              <i class="fas fa-arrow-up mr-1.5"></i> 
              <span>{{ stats.newChaptersCount }} chapters mới</span>
            </div>
          </div>
          <div class="bg-green-700/30 p-3 rounded-lg">
            <i class="fas fa-list-ul text-green-300 text-2xl"></i>
          </div>
        </div>
      </div>
      
      <!-- Total Users -->
      <div class="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-md p-5 border border-purple-700/50 hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-gray-300 font-medium">Người dùng</div>
            <div class="text-3xl font-bold text-white mt-2">{{ stats.totalUsers }}</div>
            <div class="text-purple-300 text-sm mt-1 flex items-center">
              <i class="fas fa-arrow-up mr-1.5"></i> 
              <span>{{ stats.newUsersPercent }}% từ tuần trước</span>
            </div>
          </div>
          <div class="bg-purple-700/30 p-3 rounded-lg">
            <i class="fas fa-users text-purple-300 text-2xl"></i>
          </div>
        </div>
      </div>
      
      <!-- Total Views -->
      <div class="bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg shadow-md p-5 border border-amber-700/50 hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-gray-300 font-medium">Lượt xem</div>
            <div class="text-3xl font-bold text-white mt-2">{{ formatNumber(stats.totalViews) }}</div>
            <div class="text-amber-300 text-sm mt-1 flex items-center">
              <i class="fas fa-chart-line mr-1.5"></i> 
              <span>{{ stats.viewsGrowth }}% mỗi tháng</span>
            </div>
          </div>
          <div class="bg-amber-700/30 p-3 rounded-lg">
            <i class="fas fa-eye text-amber-300 text-2xl"></i>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Activity Chart -->
      <div class="bg-gray-800 rounded-lg shadow-md p-5 border border-gray-700 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-semibold text-white">Hoạt động gần đây</h2>
          <div class="flex space-x-2">
            <button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md transition-colors">Ngày</button>
            <button class="px-3 py-1 bg-blue-600 text-sm text-white rounded-md">Tuần</button>
            <button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded-md transition-colors">Tháng</button>
          </div>
        </div>
        
        <div class="h-64 relative">
          <!-- Activity chart would go here -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-gray-500">
              <i class="fas fa-chart-line text-4xl mb-2"></i>
              <p>Biểu đồ hoạt động</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Popular Categories -->
      <div class="bg-gray-800 rounded-lg shadow-md p-5 border border-gray-700">
        <h2 class="font-semibold text-white mb-4">Thể loại phổ biến</h2>
        
        <div class="space-y-3">
          <div v-for="(category, index) in popularCategories" :key="category.id" class="flex items-center">
            <div class="w-9 h-9 flex items-center justify-center rounded-lg" :class="getCategoryColor(index)">
              <i class="fas fa-tag text-white"></i>
            </div>
            <div class="ml-3 flex-grow">
              <div class="flex justify-between">
                <div class="text-white font-medium">{{ category.name }}</div>
                <div class="text-gray-400">{{ category.count }}</div>
              </div>
              <div class="w-full bg-gray-700 h-1.5 mt-1 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full"
                  :class="getCategoryProgressColor(index)"
                  :style="`width: ${category.percentage}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- New Manga -->
    <div class="bg-gray-800 rounded-lg shadow-md border border-gray-700">
      <div class="flex justify-between items-center p-5 border-b border-gray-700">
        <h2 class="font-semibold text-white">Manga mới</h2>
        <router-link to="/admin/manga" class="text-primary hover:text-primary/80 transition-colors flex items-center text-sm">
          Xem tất cả 
          <i class="fas fa-chevron-right ml-1 text-xs"></i>
        </router-link>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tên Manga
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tác giả
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Thể loại
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Trạng thái
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Ngày thêm
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-for="manga in recentMangas" :key="manga.id" class="hover:bg-gray-750 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-md object-cover" :src="manga.coverImage" alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-white">{{ manga.title }}</div>
                    <div class="text-sm text-gray-400">{{ manga.views }} lượt xem</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ manga.author }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-for="(category, index) in manga.categories" :key="index" class="inline-block">
                  <span class="text-sm text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">{{ category }}</span>
                  <span v-if="index < manga.categories.length - 1" class="text-gray-500 mx-1">•</span>
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    manga.status === 'ONGOING' ? 'bg-green-900 text-green-300' :
                    manga.status === 'COMPLETED' ? 'bg-blue-900 text-blue-300' :
                    'bg-red-900 text-red-300'
                  ]"
                >
                  {{ formatStatus(manga.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatDate(manga.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDate } from '@/utils/format'

// Mock data
const stats = {
  totalManga: 1567,
  newMangaPercent: 12.5,
  totalChapters: 32845,
  newChaptersCount: 124,
  totalUsers: 48297,
  newUsersPercent: 7.2,
  totalViews: 15794230,
  viewsGrowth: 24.8
}

const popularCategories = [
  { id: 1, name: 'Action', count: 342, percentage: 90 },
  { id: 2, name: 'Romance', count: 258, percentage: 76 },
  { id: 3, name: 'Fantasy', count: 194, percentage: 58 },
  { id: 4, name: 'Comedy', count: 163, percentage: 49 },
  { id: 5, name: 'Drama', count: 124, percentage: 37 }
]

const recentMangas = [
  {
    id: 1,
    title: 'Solo Leveling',
    coverImage: 'https://m.media-amazon.com/images/I/81aiRRwGlaL._AC_UF1000,1000_QL80_.jpg',
    author: 'Chugong',
    categories: ['Action', 'Adventure', 'Fantasy'],
    status: 'COMPLETED',
    views: 12856,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: 2,
    title: 'Jujutsu Kaisen',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/211807.jpg',
    author: 'Gege Akutami',
    categories: ['Action', 'Supernatural', 'Horror'],
    status: 'ONGOING',
    views: 9845,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
  },
  {
    id: 3,
    title: 'One Piece',
    coverImage: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    author: 'Eiichiro Oda',
    categories: ['Action', 'Adventure', 'Comedy'],
    status: 'ONGOING',
    views: 34521,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72)
  },
  {
    id: 4,
    title: 'Chainsaw Man',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
    author: 'Tatsuki Fujimoto',
    categories: ['Action', 'Horror'],
    status: 'ONGOING',
    views: 8654,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96)
  }
]

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const getCategoryColor = (index: number): string => {
  const colors = [
    'bg-blue-600',
    'bg-purple-600',
    'bg-green-600',
    'bg-yellow-600',
    'bg-pink-600'
  ]
  return colors[index % colors.length]
}

const getCategoryProgressColor = (index: number): string => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-pink-500'
  ]
  return colors[index % colors.length]
}

const formatStatus = (status: string): string => {
  switch (status) {
    case 'ONGOING':
      return 'Đang tiến hành'
    case 'COMPLETED':
      return 'Hoàn thành'
    case 'DROPPED':
      return 'Đã hủy'
    default:
      return status
  }
}

// Lifecycle hooks
onMounted(() => {
  // Fetch real data if needed
})
</script>

<style scoped>
.text-primary {
  color: #FF6B6B;
}

.bg-primary {
  background-color: #FF6B6B;
}

.bg-primary\/80 {
  background-color: rgba(255, 107, 107, 0.8);
}

.bg-gray-750 {
  background-color: #2D3748;
}
</style> 