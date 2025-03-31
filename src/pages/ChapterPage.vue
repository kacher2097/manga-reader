<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation Bar -->
    <nav 
      class="fixed top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm shadow-lg z-50 transition-transform duration-300"
      :class="{ '-translate-y-full': hideNav }"
      @mouseenter="hideNav = false"
    >
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link 
            :to="`/manga/${mangaId}`"
            class="text-white hover:text-primary transition-colors"
          >
            <i class="fas fa-arrow-left"></i>
          </router-link>
          <h1 class="text-white font-medium truncate">
            {{ manga?.title }} - Chương {{ chapterNumber }}
          </h1>
        </div>

        <div class="flex items-center gap-4">
          <button 
            :disabled="!hasPrevChapter"
            @click="navigateChapter(-1)"
            class="text-white hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :title="hasPrevChapter ? 'Chương trước' : 'Không có chương trước'"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <select 
            v-model="chapterNumber" 
            @change="onChapterChange"
            class="bg-gray-700 text-white rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary w-32"
          >
            <option 
              v-for="chapter in chapters" 
              :key="chapter.id"
              :value="chapter.number"
            >
              Chương {{ chapter.number }}
            </option>
          </select>

          <button 
            :disabled="!hasNextChapter"
            @click="navigateChapter(1)"
            class="text-white hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :title="hasNextChapter ? 'Chương sau' : 'Không có chương sau'"
          >
            <i class="fas fa-chevron-right"></i>
          </button>

          <div class="h-6 border-l border-gray-700"></div>

          <button
            @click="toggleReadingMode"
            class="text-white hover:text-primary transition-colors"
            :title="isVerticalMode ? 'Chế độ đọc ngang' : 'Chế độ đọc dọc'"
          >
            <i :class="['fas', isVerticalMode ? 'fa-arrows-alt-v' : 'fa-arrows-alt-h']"></i>
          </button>

          <button
            @click="toggleSettings"
            class="text-white hover:text-primary transition-colors"
            title="Cài đặt"
          >
            <i class="fas fa-cog"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- Chapter Content -->
    <div 
      class="min-h-screen pt-16"
      @mousemove="onMouseMove"
    >
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="error" class="text-red-500 text-center py-8">
        <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
        <p>{{ error }}</p>
      </div>
      
      <div 
        v-else 
        class="container mx-auto px-4"
        :class="{ 'space-y-4': !isVerticalMode }"
      >
        <div 
          v-for="(page, index) in currentChapter?.pages" 
          :key="index"
          :class="[
            'mx-auto transition-transform duration-300',
            { 'max-w-4xl hover:scale-105': !isVerticalMode }
          ]"
        >
          <img
            :src="page"
            :alt="`Trang ${index + 1}`"
            class="w-full h-auto cursor-zoom-in"
            loading="lazy"
            @click="openFullscreen(index)"
          />
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div 
      class="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm shadow-lg transition-transform duration-300"
      :class="{ 'translate-y-full': hideNav }"
      @mouseenter="hideNav = false"
    >
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          :disabled="!hasPrevChapter"
          @click="navigateChapter(-1)"
          class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-chevron-left mr-2"></i>
          Chương trước
        </button>

        <div class="text-center">
          <p class="text-sm text-gray-400">Đang đọc</p>
          <p class="font-medium">Chương {{ chapterNumber }}</p>
        </div>

        <button 
          :disabled="!hasNextChapter"
          @click="navigateChapter(1)"
          class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Chương sau
          <i class="fas fa-chevron-right ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Settings Modal -->
    <div 
      v-if="showSettings"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showSettings = false"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-white mb-4">Cài đặt đọc truyện</h3>
        
        <div class="space-y-4">
          <!-- Reading Mode -->
          <div>
            <label class="text-white font-medium mb-2 block">Chế độ đọc</label>
            <div class="flex items-center space-x-4">
              <button 
                @click="isVerticalMode = true"
                :class="[
                  'px-4 py-2 rounded transition-colors',
                  isVerticalMode ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'
                ]"
              >
                <i class="fas fa-arrows-alt-v mr-2"></i>
                Dọc
              </button>
              <button 
                @click="isVerticalMode = false"
                :class="[
                  'px-4 py-2 rounded transition-colors',
                  !isVerticalMode ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'
                ]"
              >
                <i class="fas fa-arrows-alt-h mr-2"></i>
                Ngang
              </button>
            </div>
          </div>

          <!-- Image Quality -->
          <div>
            <label class="text-white font-medium mb-2 block">Chất lượng ảnh</label>
            <select 
              v-model="imageQuality"
              class="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            @click="showSettings = false"
            class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- Fullscreen Image -->
    <div 
      v-if="fullscreenImage !== null"
      class="fixed inset-0 bg-black z-50 flex items-center justify-center"
      @click="fullscreenImage = null"
    >
      <img 
        :src="currentChapter?.pages[fullscreenImage]"
        :alt="`Trang ${fullscreenImage + 1}`"
        class="max-h-screen max-w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import type { Manga, Chapter } from '@/services/api'

const route = useRoute()
const router = useRouter()

const mangaId = route.params.mangaId as string
const chapterNumber = ref(parseInt(route.params.number as string))

const manga = ref<Manga | null>(null)
const chapters = ref<Chapter[]>([])
const currentChapter = ref<Chapter | null>(null)
const loading = ref(true)
const error = ref('')

// UI State
const hideNav = ref(false)
const showSettings = ref(false)
const isVerticalMode = ref(true)
const imageQuality = ref<'high' | 'medium' | 'low'>('high')
const fullscreenImage = ref<number | null>(null)
let mouseTimer: number | null = null

const hasPrevChapter = computed(() => {
  const currentIndex = chapters.value.findIndex(c => c.number === chapterNumber.value)
  return currentIndex > 0
})

const hasNextChapter = computed(() => {
  const currentIndex = chapters.value.findIndex(c => c.number === chapterNumber.value)
  return currentIndex < chapters.value.length - 1
})

const navigateChapter = (delta: number) => {
  const currentIndex = chapters.value.findIndex(c => c.number === chapterNumber.value)
  const nextChapter = chapters.value[currentIndex + delta]
  if (nextChapter) {
    router.push(`/manga/${mangaId}/chapter/${nextChapter.number}`)
  }
}

const onChapterChange = () => {
  router.push(`/manga/${mangaId}/chapter/${chapterNumber.value}`)
}

const toggleReadingMode = () => {
  isVerticalMode.value = !isVerticalMode.value
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const openFullscreen = (index: number) => {
  fullscreenImage.value = index
}

const onMouseMove = () => {
  hideNav.value = false
  if (mouseTimer) clearTimeout(mouseTimer)
  mouseTimer = window.setTimeout(() => {
    hideNav.value = true
  }, 3000)
}

const loadChapter = async () => {
  loading.value = true
  error.value = ''
  
  try {
    currentChapter.value = await api.getChapter(mangaId, chapterNumber.value)
  } catch (err) {
    error.value = 'Không thể tải nội dung chương'
  } finally {
    loading.value = false
  }
}

watch(() => route.params.number, (newNumber) => {
  chapterNumber.value = parseInt(newNumber as string)
  loadChapter()
})

onMounted(async () => {
  try {
    // Load manga info
    manga.value = await api.getMangaById(mangaId)
    
    // Load chapter list
    chapters.value = await api.getChaptersByMangaId(mangaId)
    
    // Load current chapter
    await loadChapter()

    // Start mouse timer
    onMouseMove()
  } catch (err) {
    error.value = 'Không thể tải thông tin truyện'
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

.hover\:text-primary:hover {
  color: #FF6B6B;
}
</style> 