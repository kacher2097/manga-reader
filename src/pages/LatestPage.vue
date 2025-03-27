<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Mới cập nhật</h1>
        <p class="text-gray-400">Danh sách manga mới cập nhật gần đây</p>
      </div>

      <!-- Filter and Sort -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-4">
          <select
            v-model="filter.status"
            class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ongoing">Đang tiến hành</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
          <select
            v-model="filter.sort"
            class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="latest">Mới nhất</option>
            <option value="views">Lượt xem</option>
            <option value="chapters">Số chapter</option>
          </select>
        </div>
        <div class="relative">
          <input
            v-model="filter.search"
            type="text"
            placeholder="Tìm kiếm manga..."
            class="w-full sm:w-64 bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <!-- Manga Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div
          v-for="manga in filteredManga"
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
        v-if="!loading && filteredManga.length === 0"
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
import { ref, computed, onMounted, watch } from 'vue'

// Define Manga type
interface Manga {
  id: string;
  title: string;
  cover: string;
  status: 'ongoing' | 'completed';
  latestChapter: number;
  views: number;
  rating: number;
  updatedAt: string;
}

// Filter state
const filter = ref({
  status: 'all',
  sort: 'latest',
  search: ''
})

// Manga list state
const mangaList = ref<Manga[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// Filter manga list
const filteredManga = computed(() => {
  return mangaList.value.filter(manga => {
    // Filter by status
    if (filter.value.status !== 'all' && manga.status !== filter.value.status) {
      return false
    }
    
    // Filter by search
    if (filter.value.search && !manga.title.toLowerCase().includes(filter.value.search.toLowerCase())) {
      return false
    }
    
    return true
  }).sort((a, b) => {
    // Sort by selected option
    if (filter.value.sort === 'views') {
      return b.views - a.views
    } else if (filter.value.sort === 'chapters') {
      return b.latestChapter - a.latestChapter
    } else {
      // Default: latest
      return 0 // Already sorted by latest in the API mock
    }
  })
})

// Format number helper
const formatNumber = (num: number): string => {
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
    const newManga = generateMangaData()
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

// Generate mock manga data
const generateMangaData = (): Manga[] => {
  // Sample manga titles
  const titles = [
    'Dragon Ball', 'Naruto', 'Bleach', 'Tokyo Ghoul', 
    'Death Note', 'Fullmetal Alchemist', 'Hunter x Hunter',
    'One Punch Man', 'Spy x Family', 'Black Clover',
    'Boruto', 'Dr. Stone', 'Tower of God', 'Solo Leveling'
  ]
  
  // Sample cover images
  const covers = [
    'https://cdn.myanimelist.net/images/manga/2/253146.jpg', // One Piece
    'https://cdn.myanimelist.net/images/manga/3/216464.jpg', // Chainsaw Man
    'https://cdn.myanimelist.net/images/manga/3/211807.jpg', // Jujutsu Kaisen
    'https://cdn.myanimelist.net/images/manga/3/179023.jpg', // Demon Slayer
    'https://cdn.myanimelist.net/images/manga/1/209370.jpg', // My Hero Academia
    'https://cdn.myanimelist.net/images/manga/2/37846.jpg',  // Attack on Titan
    'https://cdn.myanimelist.net/images/manga/1/157897.jpg', // Tokyo Ghoul
    'https://cdn.myanimelist.net/images/manga/1/258213.jpg', // Spy x Family
    'https://cdn.myanimelist.net/images/manga/2/181125.jpg', // Hunter x Hunter
    'https://cdn.myanimelist.net/images/manga/3/188896.jpg', // One Punch Man
    'https://cdn.myanimelist.net/images/manga/2/161476.jpg', // Dragon Ball
    'https://cdn.myanimelist.net/images/manga/3/216933.jpg', // Solo Leveling
  ]
  
  // Sample update times
  const updateTimes = [
    '5 phút trước', '10 phút trước', '30 phút trước', '1 giờ trước', 
    '2 giờ trước', '3 giờ trước', '5 giờ trước', '8 giờ trước',
    '12 giờ trước', 'Hôm qua', '2 ngày trước'
  ]
  
  // Generate data for 12 manga
  return Array(12).fill(null).map((_, index) => {
    const titleIndex = Math.floor(Math.random() * titles.length)
    const coverIndex = Math.floor(Math.random() * covers.length)
    const timeIndex = Math.floor(Math.random() * updateTimes.length)
    const isOngoing = Math.random() > 0.3
    
    const uniqueId = `manga-${page.value}-${index}`
    
    return {
      id: uniqueId,
      title: `${titles[titleIndex]} ${page.value > 1 ? page.value : ''}`,
      cover: covers[coverIndex],
      status: isOngoing ? 'ongoing' : 'completed',
      latestChapter: Math.floor(Math.random() * 900) + 100,
      views: Math.floor(Math.random() * 9000000) + 1000000,
      rating: Number((4 + Math.random()).toFixed(1)),
      updatedAt: updateTimes[timeIndex]
    }
  })
}

// Watch for filter changes
watch([filter], () => {
  // Reset and reload data when filter changes
  if (page.value > 1) {
    mangaList.value = []
    page.value = 1
    hasMore.value = true
    loadMore()
  }
}, { deep: true })

// Initial load
onMounted(() => {
  loadMore()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 