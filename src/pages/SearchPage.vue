<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-4">
          Kết quả tìm kiếm cho "{{ searchQuery }}"
        </h1>
        <p class="text-gray-400">
          Tìm thấy {{ totalResults }} kết quả
        </p>
      </div>

      <!-- Advanced Search -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Trạng thái
            </label>
            <select
              v-model="filter.status"
              class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tất cả</option>
              <option value="ongoing">Đang tiến hành</option>
              <option value="completed">Đã hoàn thành</option>
            </select>
          </div>

          <!-- Sort -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Sắp xếp theo
            </label>
            <select
              v-model="filter.sort"
              class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="relevance">Độ phù hợp</option>
              <option value="latest">Mới cập nhật</option>
              <option value="views">Lượt xem</option>
              <option value="rating">Đánh giá</option>
              <option value="name">Tên A-Z</option>
            </select>
          </div>

          <!-- Categories -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Thể loại
            </label>
            <div class="relative">
              <select
                v-model="filter.category"
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Tất cả</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Year -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Năm xuất bản
            </label>
            <select
              v-model="filter.year"
              class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tất cả</option>
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>

        <!-- Tags -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-400 mb-2">
            Tags
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in popularTags"
              :key="tag.id"
              @click="toggleTag(tag.id)"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200',
                filter.tags.includes(tag.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div
          v-for="manga in searchResults"
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

      <!-- No Results -->
      <div
        v-if="!loading && searchResults.length === 0"
        class="text-center py-12"
      >
        <i class="fas fa-search text-4xl text-gray-600 mb-4"></i>
        <h3 class="text-xl font-medium text-white mb-2">Không tìm thấy kết quả</h3>
        <p class="text-gray-400">
          Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = computed(() => route.query.q || '')

// Filter state
const filter = ref({
  status: '',
  sort: 'relevance',
  category: '',
  year: '',
  tags: [] as string[]
})

// Mock data
const categories = [
  { id: 'action', name: 'Action' },
  { id: 'romance', name: 'Romance' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'horror', name: 'Horror' },
  { id: 'sci-fi', name: 'Sci-fi' }
]

const years = Array.from({ length: 24 }, (_, i) => 2024 - i)

const popularTags = [
  { id: 'school-life', name: 'School Life' },
  { id: 'supernatural', name: 'Supernatural' },
  { id: 'martial-arts', name: 'Martial Arts' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'drama', name: 'Drama' },
  { id: 'psychological', name: 'Psychological' },
  { id: 'slice-of-life', name: 'Slice of Life' }
]

// Search results
const searchResults = ref([
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
  }
])

const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const totalResults = ref(1234)

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

// Toggle tag selection
const toggleTag = (tagId: string) => {
  const index = filter.value.tags.indexOf(tagId)
  if (index === -1) {
    filter.value.tags.push(tagId)
  } else {
    filter.value.tags.splice(index, 1)
  }
}

// Load more results
const loadMore = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock new data
    const newResults = [
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
    
    searchResults.value.push(...newResults)
    page.value++
    
    // Check if there's more data
    hasMore.value = page.value < 5
  } catch (error) {
    console.error('Error loading more results:', error)
  } finally {
    loading.value = false
  }
}

// Watch for filter changes
watch([filter, searchQuery], () => {
  // Reset and reload data
  searchResults.value = []
  page.value = 1
  hasMore.value = true
  loadMore()
}, { deep: true })

// Initial load
onMounted(() => {
  loadMore()
})
</script> 