<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Yêu thích</h1>
        <p class="text-gray-400">Những bộ truyện bạn đã đánh dấu yêu thích</p>
      </div>

      <!-- Filters and Sort -->
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
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name">Tên A-Z</option>
            <option value="chapter">Số chapter</option>
          </select>
        </div>
        <div class="relative">
          <input
            v-model="filter.search"
            type="text"
            placeholder="Tìm kiếm trong yêu thích..."
            class="w-full sm:w-64 bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <!-- Favorites Content -->
      <div v-if="!loading && filteredFavorites.length > 0" class="space-y-8">
        <!-- Favorites Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div
            v-for="manga in filteredFavorites"
            :key="manga.id"
            class="bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:translate-y-[-4px] hover:shadow-xl"
          >
            <div class="relative">
              <!-- Cover Image Container -->
              <div class="relative aspect-[3/4] overflow-hidden">
                <img
                  :src="manga.cover"
                  :alt="manga.title"
                  class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <!-- Status Badge -->
                <div class="absolute top-2 left-2">
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      manga.status === 'ongoing' ? 'bg-green-500/90' : 'bg-blue-500/90'
                    ]"
                  >
                    {{ manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành' }}
                  </span>
                </div>
                <!-- Favorite Button -->
                <button 
                  @click.prevent="toggleFavorite(manga)"
                  class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-900/80 hover:bg-red-500/90 rounded-full transition-all"
                >
                  <i class="fas fa-heart text-red-500"></i>
                </button>
                <!-- Chapter Info -->
                <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-white font-medium">Ch.{{ manga.latestChapter }}</span>
                    <span class="text-gray-300 text-xs">{{ manga.updatedAt }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Manga Info -->
            <div class="p-3">
              <router-link :to="`/manga/${manga.id}`" class="block">
                <h3 class="font-medium text-white hover:text-red-500 transition-colors duration-300 line-clamp-2 mb-2">
                  {{ manga.title }}
                </h3>
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center text-gray-400">
                      <i class="fas fa-eye mr-1"></i>
                      <span>{{ formatNumber(manga.views) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center text-yellow-400">
                    <i class="fas fa-star mr-1"></i>
                    <span>{{ manga.rating.toFixed(1) }}</span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-if="!loading && filteredFavorites.length === 0" 
        class="bg-gray-800 rounded-lg p-8 text-center"
      >
        <div class="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <i class="fas fa-heart text-4xl text-gray-600"></i>
        </div>
        <h3 class="text-xl font-medium text-white mb-2">Chưa có truyện yêu thích</h3>
        <p class="text-gray-400 mb-6 max-w-md mx-auto">
          Hãy thêm những bộ truyện bạn yêu thích để xem cập nhật mới nhất và theo dõi tiến độ của chúng.
        </p>
        <router-link 
          to="/"
          class="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <i class="fas fa-compass mr-2"></i>
          Khám phá truyện
        </router-link>
      </div>

      <!-- Filter No Results -->
      <div
        v-if="!loading && favorites.length > 0 && filteredFavorites.length === 0"
        class="text-center py-12"
      >
        <i class="fas fa-search text-4xl text-gray-600 mb-4"></i>
        <h3 class="text-xl font-medium text-white mb-2">Không tìm thấy kết quả</h3>
        <p class="text-gray-400">
          Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
        </p>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="flex justify-center items-center py-16"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
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
  dateAdded: Date;
}

// Filter state
const filter = ref({
  status: 'all',
  sort: 'newest',
  search: ''
})

// Favorites state
const favorites = ref<Manga[]>([])
const loading = ref(false)

// Filter favorites
const filteredFavorites = computed(() => {
  return favorites.value
    .filter(manga => {
      // Filter by status
      if (filter.value.status !== 'all' && manga.status !== filter.value.status) {
        return false
      }
      
      // Filter by search
      if (filter.value.search && !manga.title.toLowerCase().includes(filter.value.search.toLowerCase())) {
        return false
      }
      
      return true
    })
    .sort((a, b) => {
      // Sort by selected option
      if (filter.value.sort === 'newest') {
        return b.dateAdded.getTime() - a.dateAdded.getTime()
      } else if (filter.value.sort === 'oldest') {
        return a.dateAdded.getTime() - b.dateAdded.getTime()
      } else if (filter.value.sort === 'name') {
        return a.title.localeCompare(b.title)
      } else if (filter.value.sort === 'chapter') {
        return b.latestChapter - a.latestChapter
      }
      return 0
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

// Toggle favorite status
const toggleFavorite = (manga: Manga) => {
  // Remove from favorites
  favorites.value = favorites.value.filter(m => m.id !== manga.id)
  // In a real app, update this in a persistent store
  // storeFavorites()
}

// Load favorites
const loadFavorites = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock favorites data
    favorites.value = generateFavoritesData()
  } catch (error) {
    console.error('Error loading favorites:', error)
  } finally {
    loading.value = false
  }
}

// Generate mock favorites data
const generateFavoritesData = (): Manga[] => {
  // Sample manga titles
  const titles = [
    'One Piece', 'Attack on Titan', 'Jujutsu Kaisen', 'Chainsaw Man',
    'Hunter x Hunter', 'Spy x Family', 'My Hero Academia', 'Demon Slayer',
    'Tokyo Ghoul', 'Solo Leveling', 'Blue Lock', 'Oshi no Ko'
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
  
  // Generate a random number of favorites (5-15)
  const count = Math.floor(Math.random() * 10) + 5
  
  // Generate data for the favorites
  return Array(count).fill(null).map((_, index) => {
    const titleIndex = Math.floor(Math.random() * titles.length)
    const coverIndex = Math.floor(Math.random() * covers.length)
    const timeIndex = Math.floor(Math.random() * updateTimes.length)
    const isOngoing = Math.random() > 0.3
    
    // Generate a date added time in the past month
    const daysAgo = Math.floor(Math.random() * 30)
    const dateAdded = new Date()
    dateAdded.setDate(dateAdded.getDate() - daysAgo)
    
    const uniqueId = `manga-fav-${index}`
    
    return {
      id: uniqueId,
      title: titles[titleIndex],
      cover: covers[coverIndex],
      status: isOngoing ? 'ongoing' : 'completed',
      latestChapter: Math.floor(Math.random() * 900) + 100,
      views: Math.floor(Math.random() * 9000000) + 1000000,
      rating: Number((4 + Math.random()).toFixed(1)),
      updatedAt: updateTimes[timeIndex],
      dateAdded
    }
  })
}

// Watch for filter changes
watch([filter], () => {
  // No need to reload data for filter changes in favorites
}, { deep: true })

// Initial load
onMounted(() => {
  loadFavorites()
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