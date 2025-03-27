<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Phổ biến</h1>
        <p class="text-gray-400">Danh sách manga được đọc nhiều nhất</p>
      </div>

      <!-- Time Filter -->
      <div class="flex items-center space-x-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          @click="filter.period = period.value"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium',
            filter.period === period.value
              ? 'bg-red-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          ]"
        >
          {{ period.label }}
        </button>
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
            v-model="filter.genre"
            class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tất cả thể loại</option>
            <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
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

      <!-- Manga Ranks -->
      <div class="mb-12">
        <!-- Top 3 Manga -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            v-for="(manga, index) in topManga"
            :key="manga.id"
            class="bg-gray-800 rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div class="relative pt-[42%]">
              <img
                :src="manga.cover"
                :alt="manga.title"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute top-0 left-0 w-12 h-12 bg-red-500 flex items-center justify-center">
                <span class="text-white text-xl font-bold">#{{ index + 1 }}</span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div class="flex items-center gap-2 text-sm">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      manga.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'
                    ]"
                  >
                    {{ manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành' }}
                  </span>
                  <span class="text-white">Ch.{{ manga.latestChapter }}</span>
                </div>
                <h3 class="text-xl font-bold text-white mt-2 line-clamp-2">
                  {{ manga.title }}
                </h3>
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center justify-between text-sm text-gray-400">
                <div class="flex items-center gap-4">
                  <div class="flex items-center">
                    <i class="fas fa-eye mr-1"></i>
                    <span>{{ formatNumber(manga.views) }}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                    <span>{{ manga.rating.toFixed(1) }}</span>
                  </div>
                </div>
                <router-link
                  :to="`/manga/${manga.id}`"
                  class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  Đọc ngay
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Other Ranked Manga -->
        <div class="space-y-4">
          <div
            v-for="(manga, index) in otherManga"
            :key="manga.id"
            class="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
          >
            <div class="flex items-center p-3">
              <div class="w-10 h-10 flex items-center justify-center bg-red-500 mr-4 flex-shrink-0">
                <span class="text-white font-bold">#{{ index + 4 }}</span>
              </div>
              <div class="relative h-16 w-12 mr-4 flex-shrink-0">
                <img
                  :src="manga.cover"
                  :alt="manga.title"
                  class="w-full h-full object-cover rounded"
                />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-medium text-white truncate mb-1">{{ manga.title }}</h3>
                <div class="flex items-center gap-3 text-sm text-gray-400">
                  <span
                    :class="[
                      'px-1.5 py-0.5 rounded text-xs font-medium',
                      manga.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'
                    ]"
                  >
                    {{ manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành' }}
                  </span>
                  <div class="flex items-center">
                    <i class="fas fa-eye mr-1"></i>
                    <span>{{ formatNumber(manga.views) }}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                    <span>{{ manga.rating.toFixed(1) }}</span>
                  </div>
                </div>
              </div>
              <router-link
                :to="`/manga/${manga.id}`"
                class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm ml-4 flex-shrink-0"
              >
                Đọc ngay
              </router-link>
            </div>
          </div>
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
  genre?: string[];
}

// Time periods
const timePeriods = [
  { label: 'Hôm nay', value: 'today' },
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
  { label: 'Quý này', value: 'quarter' },
  { label: '6 tháng', value: 'half-year' },
  { label: 'Năm nay', value: 'year' },
  { label: 'Mọi thời gian', value: 'all-time' }
]

// Available genres
const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Mystery', 'Romance', 'Sci-fi', 'Slice of Life', 
  'Sports', 'Supernatural', 'Thriller', 'Historical'
]

// Filter state
const filter = ref({
  period: 'week',
  status: 'all',
  genre: 'all',
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
    
    // Filter by genre
    if (filter.value.genre !== 'all' && !manga.genre?.includes(filter.value.genre)) {
      return false
    }
    
    // Filter by search
    if (filter.value.search && !manga.title.toLowerCase().includes(filter.value.search.toLowerCase())) {
      return false
    }
    
    return true
  })
})

// Get top 3 manga
const topManga = computed(() => {
  return filteredManga.value.slice(0, 3)
})

// Get other manga
const otherManga = computed(() => {
  return filteredManga.value.slice(3)
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
    'One Piece', 'Attack on Titan', 'Berserk', 'Vagabond', 
    'Vinland Saga', 'Kingdom', 'Slam Dunk', 'Vagabond',
    'JoJo\'s Bizarre Adventure', 'Chainsaw Man', 'Jujutsu Kaisen',
    'Hunter x Hunter', 'Demon Slayer', 'My Hero Academia',
    'Oshi no Ko', 'Blue Lock', 'Spy x Family'
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
  
  // Generate data for 10 manga
  return Array(10).fill(null).map((_, index) => {
    const titleIndex = Math.floor(Math.random() * titles.length)
    const coverIndex = Math.floor(Math.random() * covers.length)
    const isOngoing = Math.random() > 0.3
    
    // Generate random view count with higher numbers for more popular manga
    const viewMultiplier = page.value === 1 ? (10 - index) : 1
    const baseViews = Math.floor(Math.random() * 1000000) + 500000
    
    // Generate random genres (2-4 genres per manga)
    const genreCount = Math.floor(Math.random() * 3) + 2
    const mangaGenres: string[] = []
    for (let i = 0; i < genreCount; i++) {
      const randomGenre = genres[Math.floor(Math.random() * genres.length)]
      if (!mangaGenres.includes(randomGenre)) {
        mangaGenres.push(randomGenre)
      }
    }
    
    const uniqueId = `manga-pop-${page.value}-${index}`
    
    return {
      id: uniqueId,
      title: `${titles[titleIndex]} ${page.value > 1 ? page.value : ''}`,
      cover: covers[coverIndex],
      status: isOngoing ? 'ongoing' : 'completed',
      latestChapter: Math.floor(Math.random() * 900) + 100,
      views: baseViews * viewMultiplier,
      rating: Number((4 + Math.random()).toFixed(1)),
      genre: mangaGenres
    }
  })
}

// Watch for filter changes
watch([filter], () => {
  // Reset and reload data when filter period, status, or genre changes
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style> 