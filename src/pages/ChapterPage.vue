<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="container mx-auto px-4">
      <!-- Chapter Navigation -->
      <div class="flex items-center justify-between mb-6 bg-gray-800 rounded-lg p-4">
        <div class="flex items-center space-x-4">
          <router-link 
            :to="`/manga/${mangaId}`"
            class="text-white hover:text-red-500 transition-colors"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Quay lại
          </router-link>
          <div>
            <h1 class="text-white text-xl font-bold">{{ mangaTitle }}</h1>
            <p class="text-gray-400 text-sm">{{ chapterTitle }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            @click="prevChapter"
            :disabled="!hasPrevChapter"
            :class="[
              'px-4 py-2 rounded transition-colors',
              hasPrevChapter 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            ]"
          >
            <i class="fas fa-chevron-left mr-2"></i>
            Chapter trước
          </button>
          <select 
            v-model="currentChapter"
            @change="changeChapter"
            class="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option 
              v-for="chapter in chapters"
              :key="chapter.id"
              :value="chapter.number"
            >
              Chapter {{ chapter.number }} - {{ chapter.title }}
            </option>
          </select>
          <button 
            @click="nextChapter"
            :disabled="!hasNextChapter"
            :class="[
              'px-4 py-2 rounded transition-colors',
              hasNextChapter 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            ]"
          >
            Chapter sau
            <i class="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 bg-red-500 text-white p-4 rounded-lg">
        {{ error }}
      </div>

      <!-- Reading Settings -->
      <div class="mb-6 bg-gray-800 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-2">
              <span class="text-white">Chế độ đọc:</span>
              <select 
                v-model="readingMode"
                class="bg-gray-700 text-white px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="vertical">Cuộn dọc</option>
                <option value="horizontal">Cuộn ngang</option>
                <option value="single">Từng trang</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-white">Chiều rộng:</span>
              <select 
                v-model="imageWidth"
                class="bg-gray-700 text-white px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="auto">Tự động</option>
                <option value="800">800px</option>
                <option value="1000">1000px</option>
                <option value="1200">1200px</option>
                <option value="full">Toàn màn hình</option>
              </select>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="toggleFullscreen"
              class="text-white hover:text-red-500 transition-colors"
            >
              <i :class="['fas', isFullscreen ? 'fa-compress' : 'fa-expand']"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Chapter Content -->
      <div 
        :class="[
          'chapter-content',
          `mode-${readingMode}`,
          imageWidth === 'full' ? 'w-full' : 'max-w-screen-xl mx-auto'
        ]"
      >
        <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        </div>
        <template v-else>
          <!-- Vertical Mode -->
          <div v-if="readingMode === 'vertical'" class="space-y-4">
            <img 
              v-for="(image, index) in chapterImages"
              :key="index"
              :src="image"
              :alt="`Page ${index + 1}`"
              :style="imageWidth !== 'full' && imageWidth !== 'auto' ? `width: ${imageWidth}px` : ''"
              class="mx-auto rounded shadow-lg"
              @load="handleImageLoad"
              loading="lazy"
            />
          </div>

          <!-- Horizontal Mode -->
          <div v-else-if="readingMode === 'horizontal'" class="flex overflow-x-auto snap-x snap-mandatory">
            <div 
              v-for="(image, index) in chapterImages"
              :key="index"
              class="flex-shrink-0 snap-center"
            >
              <img 
                :src="image"
                :alt="`Page ${index + 1}`"
                :style="imageWidth !== 'full' && imageWidth !== 'auto' ? `width: ${imageWidth}px` : ''"
                class="mx-auto rounded shadow-lg"
                @load="handleImageLoad"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Single Page Mode -->
          <div v-else class="flex justify-center">
            <div class="relative">
              <img 
                :src="chapterImages[currentPage]"
                :alt="`Page ${currentPage + 1}`"
                :style="imageWidth !== 'full' && imageWidth !== 'auto' ? `width: ${imageWidth}px` : ''"
                class="mx-auto rounded shadow-lg"
                @load="handleImageLoad"
              />
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 px-4 py-2 rounded-full">
                <span class="text-white">{{ currentPage + 1 }} / {{ chapterImages.length }}</span>
              </div>
              <button 
                v-if="currentPage > 0"
                @click="prevPage"
                class="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/80 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                v-if="currentPage < chapterImages.length - 1"
                @click="nextPage"
                class="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/80 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Bottom Navigation -->
      <div class="mt-6 bg-gray-800 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <button 
            @click="prevChapter"
            :disabled="!hasPrevChapter"
            :class="[
              'px-4 py-2 rounded transition-colors',
              hasPrevChapter 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            ]"
          >
            <i class="fas fa-chevron-left mr-2"></i>
            Chapter trước
          </button>
          <div class="text-center">
            <h2 class="text-white text-lg font-medium mb-1">Chapter {{ currentChapter }}</h2>
            <p class="text-gray-400">{{ mangaTitle }}</p>
          </div>
          <button 
            @click="nextChapter"
            :disabled="!hasNextChapter"
            :class="[
              'px-4 py-2 rounded transition-colors',
              hasNextChapter 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            ]"
          >
            Chapter sau
            <i class="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Chapter {
  id: string
  mangaId: string
  number: number
  title: string
  pages: string[]
  views: number
  createdAt: number
  updatedAt: number
}

const route = useRoute()
const router = useRouter()

// States
const loading = ref(true)
const error = ref<string | null>(null)
const mangaId = ref(route.params.id as string)
const mangaTitle = ref('Demon Slayer')
const currentChapter = ref(Number(route.params.chapter))
const readingMode = ref('vertical')
const imageWidth = ref('auto')
const isFullscreen = ref(false)
const currentPage = ref(0)
const loadedImages = ref(0)

// Chapter data
const chapters = ref<Chapter[]>([])
const currentChapterData = ref<Chapter | null>(null)
const chapterImages = computed(() => currentChapterData.value?.pages || [])

// Computed
const hasPrevChapter = computed(() => {
  const currentIndex = chapters.value.findIndex(c => c.number === currentChapter.value)
  return currentIndex > 0
})

const hasNextChapter = computed(() => {
  const currentIndex = chapters.value.findIndex(c => c.number === currentChapter.value)
  return currentIndex < chapters.value.length - 1
})

const chapterTitle = computed(() => {
  return currentChapterData.value?.title || `Chapter ${currentChapter.value}`
})

// Methods
const loadChapters = async () => {
  try {
    // Giả lập API call, thay thế bằng API thực tế
    const response = await fetch('/api/chapters')
    const data = await response.json()
    chapters.value = data.sort((a: Chapter, b: Chapter) => b.number - a.number)
  } catch (err) {
    console.error('Error loading chapters:', err)
    error.value = 'Không thể tải danh sách chapter'
  }
}

const loadChapterData = async () => {
  loading.value = true
  loadedImages.value = 0
  error.value = null
  
  try {
    // Tìm chapter hiện tại từ danh sách đã load
    currentChapterData.value = chapters.value.find(c => c.number === currentChapter.value) || null
    
    if (!currentChapterData.value) {
      throw new Error('Chapter không tồn tại')
    }

    // Cập nhật tiêu đề manga và chapter
    mangaTitle.value = 'Demon Slayer'
    
    // Reset current page khi đổi chapter trong chế độ single
    if (readingMode.value === 'single') {
      currentPage.value = 0
    }
  } catch (err) {
    console.error('Error loading chapter:', err)
    error.value = 'Không thể tải nội dung chapter'
  } finally {
    loading.value = false
  }
}

const changeChapter = () => {
  router.push(`/manga/${mangaId.value}/chapter/${currentChapter.value}`)
}

const prevChapter = () => {
  if (hasPrevChapter.value) {
    const currentIndex = chapters.value.findIndex(c => c.number === currentChapter.value)
    currentChapter.value = chapters.value[currentIndex - 1].number
    changeChapter()
  }
}

const nextChapter = () => {
  if (hasNextChapter.value) {
    const currentIndex = chapters.value.findIndex(c => c.number === currentChapter.value)
    currentChapter.value = chapters.value[currentIndex + 1].number
    changeChapter()
  }
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < chapterImages.value.length - 1) {
    currentPage.value++
  }
}

const handleImageLoad = () => {
  loadedImages.value++
  if (loadedImages.value === chapterImages.value.length) {
    loading.value = false
  }
}

// Keyboard navigation for single page mode
const handleKeyPress = (event: KeyboardEvent) => {
  if (readingMode.value === 'single') {
    if (event.key === 'ArrowLeft') {
      prevPage()
    } else if (event.key === 'ArrowRight') {
      nextPage()
    }
  }
}

// Watch route changes
watch(
  () => route.params.chapter,
  async (newChapter) => {
    if (newChapter) {
      currentChapter.value = Number(newChapter)
      await loadChapterData()
    }
  }
)

// Lifecycle hooks
onMounted(async () => {
  await loadChapters()
  await loadChapterData()
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.chapter-content {
  min-height: 400px;
}

.mode-horizontal {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.mode-horizontal::-webkit-scrollbar {
  height: 8px;
}

.mode-horizontal::-webkit-scrollbar-track {
  background: #1a202c;
  border-radius: 4px;
}

.mode-horizontal::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 4px;
}

.mode-horizontal::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 