<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Header with Background Image -->
    <div v-if="manga" class="relative h-[300px] md:h-[400px]">
      <img 
        :src="manga.coverImage"
        :alt="manga.title"
        class="w-full h-full object-cover blur-sm opacity-50"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
    </div>

    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div class="text-red-500 text-center">
        <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-else-if="manga" class="container mx-auto px-4">
      <!-- Manga Info Section -->
      <div class="relative z-10 -mt-32 mb-8">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Cover Image -->
          <div class="w-full md:w-1/3 lg:w-1/4">
            <img 
              :src="manga.coverImage" 
              :alt="manga.title"
              class="w-full rounded-lg shadow-xl"
            />
          </div>
          
          <!-- Info -->
          <div class="flex-1">
            <h1 class="text-4xl font-bold mb-4">{{ manga.title }}</h1>
            
            <div class="flex flex-wrap gap-2 mb-6">
              <span 
                v-for="category in manga.categories" 
                :key="category"
                class="px-4 py-1.5 bg-gray-800 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {{ category }}
              </span>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div class="bg-gray-800 rounded-lg p-4">
                <p class="text-gray-400 text-sm mb-1">Tác giả</p>
                <p class="font-medium">{{ manga.author }}</p>
              </div>
              <div class="bg-gray-800 rounded-lg p-4">
                <p class="text-gray-400 text-sm mb-1">Họa sĩ</p>
                <p class="font-medium">{{ manga.artist }}</p>
              </div>
              <div class="bg-gray-800 rounded-lg p-4">
                <p class="text-gray-400 text-sm mb-1">Tình trạng</p>
                <p class="font-medium">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      manga.status === 'ongoing' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ manga.status === 'ongoing' ? 'Đang tiến hành' : 'Đã hoàn thành' }}
                  </span>
                </p>
              </div>
              <div class="bg-gray-800 rounded-lg p-4">
                <p class="text-gray-400 text-sm mb-1">Năm phát hành</p>
                <p class="font-medium">{{ manga.releaseYear }}</p>
              </div>
            </div>
            
            <p class="text-gray-300 text-lg leading-relaxed mb-8">{{ manga.description }}</p>
            
            <div class="flex items-center gap-8">
              <div class="text-center">
                <p class="text-3xl font-bold text-primary">{{ formatNumber(manga.views) }}</p>
                <p class="text-gray-400 text-sm">Lượt xem</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-primary">{{ manga.rating.toFixed(1) }}</p>
                <p class="text-gray-400 text-sm">Đánh giá</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-primary">{{ chapters.length }}</p>
                <p class="text-gray-400 text-sm">Chương</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chapter List Section -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">Danh sách chương</h2>
          <div class="flex items-center gap-4">
            <select 
              v-model="sortOrder"
              class="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </select>
          </div>
        </div>
        
        <div v-if="loadingChapters" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        
        <div v-else-if="errorChapters" class="text-red-500 text-center py-8">
          {{ errorChapters }}
        </div>
        
        <div v-else>
          <!-- Chapter Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <router-link
              v-for="chapter in sortedChapters"
              :key="chapter.id"
              :to="`/manga/${manga.id}/chapter/${chapter.number}`"
              class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
            >
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <span class="text-lg font-medium group-hover:text-primary transition-colors">
                    Chương {{ chapter.number }}
                  </span>
                  <span class="text-sm text-gray-400">
                    {{ formatDate(chapter.createdAt) }}
                  </span>
                </div>
                <p class="text-sm text-gray-400 mt-1 line-clamp-1">
                  {{ chapter.title }}
                </p>
              </div>
              <i class="fas fa-chevron-right text-gray-500 group-hover:text-primary transition-colors"></i>
            </router-link>
          </div>

          <!-- Pagination -->
          <div class="flex justify-center gap-2">
            <button 
              v-for="page in totalPages" 
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                currentPage === page 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import type { Manga, Chapter } from '@/services/api'

const route = useRoute()
const manga = ref<Manga | null>(null)
const chapters = ref<Chapter[]>([])
const loading = ref(true)
const loadingChapters = ref(true)
const error = ref('')
const errorChapters = ref('')

// Pagination and Sorting
const currentPage = ref(1)
const itemsPerPage = 30
const sortOrder = ref<'asc' | 'desc'>('desc')

const totalPages = computed(() => Math.ceil(chapters.value.length / itemsPerPage))

const sortedChapters = computed(() => {
  const sorted = [...chapters.value].sort((a, b) => {
    return sortOrder.value === 'desc' 
      ? b.number - a.number 
      : a.number - b.number
  })
  
  const start = (currentPage.value - 1) * itemsPerPage
  return sorted.slice(start, start + itemsPerPage)
})

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Vừa xong'
    return `${hours} giờ trước`
  }
  
  // Less than 30 days
  if (diff < 2592000000) {
    const days = Math.floor(diff / 86400000)
    return `${days} ngày trước`
  }
  
  return date.toLocaleDateString('vi-VN')
}

onMounted(async () => {
  const mangaId = route.params.id as string
  
  try {
    manga.value = await api.getMangaById(mangaId)
  } catch (err) {
    error.value = 'Không thể tải thông tin truyện'
  } finally {
    loading.value = false
  }

  try {
    chapters.value = await api.getChaptersByMangaId(mangaId)
  } catch (err) {
    errorChapters.value = 'Không thể tải danh sách chương'
  } finally {
    loadingChapters.value = false
  }
})
</script>

<style scoped>
.text-primary {
  color: #FF6B6B;
}

.bg-primary {
  background-color: #FF6B6B;
}

.border-primary {
  border-color: #FF6B6B;
}

.ring-primary {
  --tw-ring-color: #FF6B6B;
}

.group-hover\:text-primary:group-hover {
  color: #FF6B6B;
}
</style> 