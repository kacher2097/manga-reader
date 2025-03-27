<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Đọc tiếp</h1>
        <p class="text-gray-400">Tiếp tục đọc từ chỗ bạn đã dừng lại</p>
      </div>

      <!-- Continue Reading Section -->
      <div class="mb-12">
        <h2 class="text-xl font-bold text-white mb-4">Đang đọc gần đây</h2>
        
        <!-- Recent Manga -->
        <div v-if="recentManga.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="manga in recentManga"
            :key="manga.id"
            class="bg-gray-800 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl"
          >
            <div class="flex">
              <div class="w-1/3 relative">
                <img
                  :src="manga.cover"
                  :alt="manga.title"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
              </div>
              <div class="w-2/3 p-4">
                <h3 class="font-medium text-white text-lg mb-1 line-clamp-1">{{ manga.title }}</h3>
                <div class="flex items-center gap-2 text-sm mb-3">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-xs font-medium',
                      manga.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'
                    ]"
                  >
                    {{ manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành' }}
                  </span>
                </div>
                <div class="text-gray-400 text-sm mb-2">
                  <div class="flex items-center gap-2 mb-1">
                    <i class="fas fa-bookmark"></i>
                    <span>Đang đọc: Chapter {{ manga.currentChapter }}</span>
                  </div>
                  <div class="flex items-center gap-2 mb-1">
                    <i class="fas fa-clock"></i>
                    <span>{{ manga.lastReadTime }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fas fa-eye"></i>
                    <span>{{ formatNumber(manga.views) }} lượt xem</span>
                  </div>
                </div>
                <div class="flex space-x-2 mt-3">
                  <router-link
                    :to="`/reader/${manga.id}/${manga.currentChapter}`"
                    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-1 text-center"
                  >
                    Đọc tiếp
                  </router-link>
                  <router-link
                    :to="`/manga/${manga.id}`"
                    class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex-1 text-center"
                  >
                    Chi tiết
                  </router-link>
                </div>
              </div>
            </div>
            <div class="bg-gray-700 h-1.5">
              <div 
                class="bg-red-500 h-full"
                :style="{ width: `${manga.readingProgress}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div 
          v-else
          class="bg-gray-800 rounded-lg p-8 text-center"
        >
          <div class="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i class="fas fa-book-open text-4xl text-gray-600"></i>
          </div>
          <h3 class="text-xl font-medium text-white mb-2">Chưa có truyện đang đọc</h3>
          <p class="text-gray-400 mb-6 max-w-md mx-auto">
            Bạn chưa bắt đầu đọc truyện nào. Hãy khám phá danh sách truyện và bắt đầu đọc ngay nào!
          </p>
          <router-link 
            to="/"
            class="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <i class="fas fa-compass mr-2"></i>
            Khám phá truyện
          </router-link>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="recommendations.length > 0">
        <h2 class="text-xl font-bold text-white mb-4">Đề xuất cho bạn</h2>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div
            v-for="manga in recommendations"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Define types
interface RecentManga {
  id: string;
  title: string;
  cover: string;
  status: 'ongoing' | 'completed';
  currentChapter: number;
  latestChapter: number;
  lastReadTime: string;
  readingProgress: number;
  views: number;
}

interface RecommendedManga {
  id: string;
  title: string;
  cover: string;
  status: 'ongoing' | 'completed';
  latestChapter: number;
  views: number;
  rating: number;
  updatedAt: string;
}

// State
const recentManga = ref<RecentManga[]>([])
const recommendations = ref<RecommendedManga[]>([])
const loading = ref(false)

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

// Load recent manga and recommendations
const loadMangaData = async () => {
  loading.value = true
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock recent manga data
    recentManga.value = [
      {
        id: 'one-piece',
        title: 'One Piece',
        cover: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
        status: 'ongoing',
        currentChapter: 1089,
        latestChapter: 1090,
        lastReadTime: '2 giờ trước',
        readingProgress: 85,
        views: 15000000
      },
      {
        id: 'jujutsu-kaisen',
        title: 'Jujutsu Kaisen',
        cover: 'https://cdn.myanimelist.net/images/manga/3/211807.jpg',
        status: 'ongoing',
        currentChapter: 215,
        latestChapter: 220,
        lastReadTime: '1 ngày trước',
        readingProgress: 62,
        views: 8500000
      },
      {
        id: 'chainsaw-man',
        title: 'Chainsaw Man',
        cover: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
        status: 'ongoing',
        currentChapter: 125,
        latestChapter: 130,
        lastReadTime: '3 ngày trước',
        readingProgress: 45,
        views: 7300000
      }
    ]
    
    // Mock recommendations
    recommendations.value = generateRecommendedManga()
  } catch (error) {
    console.error('Error loading manga data:', error)
  } finally {
    loading.value = false
  }
}

// Generate mock recommended manga
const generateRecommendedManga = (): RecommendedManga[] => {
  // Sample manga titles
  const titles = [
    'Demon Slayer', 'Attack on Titan', 'My Hero Academia', 'Solo Leveling',
    'Spy x Family', 'Tokyo Ghoul', 'Hunter x Hunter', 'Bleach',
    'Naruto', 'Dragon Ball', 'Black Clover', 'Fire Force'
  ]
  
  // Sample cover images
  const covers = [
    'https://cdn.myanimelist.net/images/manga/3/179023.jpg', // Demon Slayer
    'https://cdn.myanimelist.net/images/manga/2/37846.jpg',  // Attack on Titan
    'https://cdn.myanimelist.net/images/manga/1/209370.jpg', // My Hero Academia
    'https://cdn.myanimelist.net/images/manga/3/216933.jpg', // Solo Leveling
    'https://cdn.myanimelist.net/images/manga/1/258213.jpg', // Spy x Family
    'https://cdn.myanimelist.net/images/manga/1/157897.jpg', // Tokyo Ghoul
    'https://cdn.myanimelist.net/images/manga/2/181125.jpg', // Hunter x Hunter
    'https://cdn.myanimelist.net/images/anime/3/40451.jpg',  // Bleach
    'https://cdn.myanimelist.net/images/manga/3/188896.jpg', // One Punch Man
    'https://cdn.myanimelist.net/images/manga/2/161476.jpg', // Dragon Ball
  ]
  
  // Sample update times
  const updateTimes = [
    '5 phút trước', '10 phút trước', '30 phút trước', '1 giờ trước', 
    '2 giờ trước', '3 giờ trước', '5 giờ trước', '8 giờ trước',
    '12 giờ trước', 'Hôm qua', '2 ngày trước'
  ]
  
  // Generate 6 recommended manga
  return Array(6).fill(null).map((_, index) => {
    const titleIndex = Math.floor(Math.random() * titles.length)
    const coverIndex = Math.floor(Math.random() * covers.length)
    const timeIndex = Math.floor(Math.random() * updateTimes.length)
    const isOngoing = Math.random() > 0.3
    
    return {
      id: `manga-rec-${index}`,
      title: titles[titleIndex],
      cover: covers[coverIndex],
      status: isOngoing ? 'ongoing' : 'completed',
      latestChapter: Math.floor(Math.random() * 900) + 100,
      views: Math.floor(Math.random() * 9000000) + 1000000,
      rating: Number((4 + Math.random()).toFixed(1)),
      updatedAt: updateTimes[timeIndex]
    }
  })
}

// Initial load
onMounted(() => {
  loadMangaData()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 