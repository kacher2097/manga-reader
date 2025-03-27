<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Category Header -->
      <div class="relative h-64 rounded-lg overflow-hidden mb-8">
        <img
          :src="category.image"
          :alt="category.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <h1 class="text-4xl font-bold text-white mb-2">{{ category.name }}</h1>
          <p class="text-gray-300 text-lg max-w-3xl">{{ category.description }}</p>
          <div class="flex items-center gap-4 mt-4">
            <div class="flex items-center text-gray-400">
              <i class="fas fa-book mr-2"></i>
              <span>{{ category.mangaCount }} manga</span>
            </div>
            <div class="flex items-center text-gray-400">
              <i class="fas fa-eye mr-2"></i>
              <span>{{ formatNumber(category.totalViews) }} lượt xem</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter and Sort -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-4">
          <select
            v-model="filter.status"
            class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ongoing">Đang tiến hành</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
          <select
            v-model="filter.sort"
            class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="latest">Mới cập nhật</option>
            <option value="views">Lượt xem</option>
            <option value="rating">Đánh giá</option>
            <option value="name">Tên A-Z</option>
          </select>
        </div>
        <div class="relative">
          <input
            v-model="filter.search"
            type="text"
            placeholder="Tìm kiếm trong thể loại..."
            class="w-full sm:w-64 bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <!-- Manga Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div
          v-for="manga in mangaList"
          :key="manga.id"
          class="group"
        >
          <router-link :to="`/manga/${manga.id}`">
            <div class="relative aspect-[3/4] rounded-lg overflow-hidden mb-3">
              <img
                :src="manga.cover"
                :alt="manga.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute top-2 left-2">
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    manga.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'
                  ]"
                >
                  {{ manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành' }}
                </span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div class="flex items-center gap-2 text-sm">
                  <span class="text-white">Ch.{{ manga.latestChapter }}</span>
                  <span class="text-gray-400">{{ manga.updatedAt }}</span>
                </div>
              </div>
            </div>
            <h3 class="font-medium text-white group-hover:text-red-500 transition-colors duration-300 line-clamp-2">
              {{ manga.title }}
            </h3>
            <div class="flex items-center gap-3 mt-1 text-sm text-gray-400">
              <div class="flex items-center">
                <i class="fas fa-eye mr-1"></i>
                <span>{{ formatNumber(manga.views) }}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-star text-yellow-400 mr-1"></i>
                <span>{{ manga.rating.toFixed(1) }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="flex justify-center items-center py-8"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
      </div>

      <!-- Load More -->
      <div
        v-if="!loading && hasMore"
        class="flex justify-center mt-8"
      >
        <button
          @click="loadMore"
          class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Xem thêm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const categoryId = route.params.id

// Category data
const category = {
  id: categoryId,
  name: 'Action',
  description: 'Thể loại này thường có nội dung về đánh nhau, bạo lực, hỗn loạn, với diễn biến nhanh.',
  image: 'https://example.com/images/categories/action.jpg',
  mangaCount: 1234,
  totalViews: 5678901
}

// Filter state
const filter = ref({
  status: '',
  sort: 'latest',
  search: ''
})

// Manga list state
const mangaList = ref([
  {
    id: '1',
    title: 'One Piece',
    cover: 'https://example.com/images/manga/one-piece.jpg',
    status: 'ongoing',
    latestChapter: 1089,
    updatedAt: '1 giờ trước',
    views: 1234567,
    rating: 4.9
  },
  {
    id: '2',
    title: 'Naruto',
    cover: 'https://example.com/images/manga/naruto.jpg',
    status: 'completed',
    latestChapter: 700,
    updatedAt: '2 giờ trước',
    views: 987654,
    rating: 4.8
  },
  // Add more manga items...
])

const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// Format number helper
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Load more manga
const loadMore = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock new data
    const newManga = [
      {
        id: '3',
        title: 'Dragon Ball',
        cover: 'https://example.com/images/manga/dragon-ball.jpg',
        status: 'completed',
        latestChapter: 519,
        updatedAt: '3 giờ trước',
        views: 876543,
        rating: 4.7
      },
      {
        id: '4',
        title: 'Bleach',
        cover: 'https://example.com/images/manga/bleach.jpg',
        status: 'completed',
        latestChapter: 686,
        updatedAt: '4 giờ trước',
        views: 765432,
        rating: 4.6
      }
    ]
    
    mangaList.value.push(...newManga)
    page.value++
    
    // Check if there's more data
    hasMore.value = page.value < 5
  } catch (error) {
    console.error('Error loading more manga:', error)
  } finally {
    loading.value = false
  }
}

// Watch for filter changes
watch(filter, () => {
  // Reset and reload data
  mangaList.value = []
  page.value = 1
  hasMore.value = true
  loadMore()
}, { deep: true })

// Initial load
onMounted(() => {
  loadMore()
})
</script> 