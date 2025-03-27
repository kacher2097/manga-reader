<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Top Navigation -->
    <nav 
      class="fixed top-0 left-0 right-0 bg-gray-800 z-50 transition-transform duration-300"
      :class="{ '-translate-y-full': hideControls }"
      @mouseenter="hideControls = false"
    >
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <router-link
              :to="'/manga/' + mangaId"
              class="text-white hover:text-red-500 transition-colors"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Quay lại
            </router-link>
            <h1 class="text-lg font-semibold text-white">
              {{ mangaTitle }} - Chapter {{ chapterNumber }}
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Chapter Navigation -->
            <div class="flex items-center space-x-2">
              <button
                class="p-2 text-white hover:text-red-500 transition-colors disabled:opacity-50"
                :disabled="!hasPreviousChapter"
                @click="previousChapter"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <select
                v-model="currentChapter"
                class="bg-gray-700 text-white rounded px-3 py-1 focus:ring-2 focus:ring-red-500"
                @change="changeChapter"
              >
                <option
                  v-for="chapter in chapters"
                  :key="chapter.number"
                  :value="chapter.number"
                >
                  Chapter {{ chapter.number }}
                </option>
              </select>

              <button
                class="p-2 text-white hover:text-red-500 transition-colors disabled:opacity-50"
                :disabled="!hasNextChapter"
                @click="nextChapter"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <!-- Reading Settings -->
            <div class="relative">
              <button
                class="p-2 text-white hover:text-red-500 transition-colors"
                @click="showSettings = !showSettings"
              >
                <i class="fas fa-cog"></i>
              </button>

              <!-- Settings Dropdown -->
              <div
                v-if="showSettings"
                class="absolute top-full right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-4"
                @click.stop
              >
                <h3 class="text-lg font-semibold text-white mb-4">Cài đặt đọc</h3>
                
                <div class="space-y-4">
                  <!-- Reading Mode -->
                  <div>
                    <label class="block text-white mb-2">Chế độ đọc</label>
                    <select
                      v-model="readingMode"
                      class="w-full bg-gray-700 text-white rounded px-3 py-1 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="vertical">Cuộn dọc</option>
                      <option value="horizontal">Cuộn ngang</option>
                      <option value="single">Một trang</option>
                    </select>
                  </div>

                  <!-- Page Width -->
                  <div>
                    <label class="block text-white mb-2">
                      Chiều rộng trang ({{ pageWidth }}%)
                    </label>
                    <input
                      type="range"
                      v-model="pageWidth"
                      min="50"
                      max="100"
                      class="w-full"
                    />
                  </div>

                  <!-- Page Gap -->
                  <div>
                    <label class="block text-white mb-2">
                      Khoảng cách trang ({{ pageGap }}px)
                    </label>
                    <input
                      type="range"
                      v-model="pageGap"
                      min="0"
                      max="50"
                      class="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Chapter Content -->
    <div
      class="pt-16 pb-16 transition-all duration-300"
      :class="{
        'container mx-auto px-4': true,
        'space-y-4': readingMode === 'vertical',
        'flex overflow-x-auto snap-x snap-mandatory': readingMode === 'horizontal',
        'flex justify-center items-center min-h-screen': readingMode === 'single',
      }"
      @mousemove="handleMouseMove"
      @click="handleClick"
    >
      <template v-if="readingMode === 'horizontal'">
        <div
          v-for="(page, index) in pages"
          :key="index"
          class="shrink-0 snap-center"
          :style="{ 
            width: pageWidth + '%',
            'margin-right': index < pages.length - 1 ? pageGap + 'px' : '0'
          }"
        >
          <img
            :src="page"
            :alt="'Page ' + (index + 1)"
            class="w-full"
            loading="lazy"
          />
        </div>
      </template>

      <template v-else-if="readingMode === 'vertical'">
        <img
          v-for="(page, index) in pages"
          :key="index"
          :src="page"
          :alt="'Page ' + (index + 1)"
          :style="{ width: pageWidth + '%' }"
          class="mx-auto"
          loading="lazy"
        />
      </template>

      <template v-else>
        <img
          :src="pages[currentPage - 1]"
          :alt="'Page ' + currentPage"
          :style="{ width: pageWidth + '%' }"
          class="mx-auto"
          @click="nextPage"
          loading="lazy"
        />
      </template>
    </div>

    <!-- Bottom Navigation -->
    <nav 
      class="fixed bottom-0 left-0 right-0 bg-gray-800 z-50 transition-transform duration-300"
      :class="{ 'translate-y-full': hideControls }"
      @mouseenter="hideControls = false"
    >
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <button
            class="text-white hover:text-red-500 transition-colors disabled:opacity-50"
            :disabled="!hasPreviousChapter"
            @click="previousChapter"
          >
            Chapter trước
          </button>

          <div class="text-white">
            <span v-if="readingMode === 'single'">
              {{ currentPage }} / {{ totalPages }}
            </span>
          </div>

          <button
            class="text-white hover:text-red-500 transition-colors disabled:opacity-50"
            :disabled="!hasNextChapter"
            @click="nextChapter"
          >
            Chapter sau
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Route params
const mangaId = route.params.id as string
const chapterNumber = parseInt(route.params.chapter as string)
const mangaTitle = 'One Piece' // This should come from your store or API

// Reading settings
const readingMode = ref<'vertical' | 'horizontal' | 'single'>('vertical')
const pageWidth = ref(80)
const pageGap = ref(10)
const currentPage = ref(1)
const showSettings = ref(false)
const hideControls = ref(false)
let hideControlsTimeout: ReturnType<typeof setTimeout>

// Mock data
const chapters = ref([
  { number: 1089, title: 'The Strongest Man in the World' },
  { number: 1088, title: 'The Final Battle' },
  { number: 1087, title: 'The New Era' },
])

const pages = ref([
  '/images/chapters/1089/001.jpg',
  '/images/chapters/1089/002.jpg',
  '/images/chapters/1089/003.jpg',
  '/images/chapters/1089/004.jpg',
  '/images/chapters/1089/005.jpg',
])

// Computed
const totalPages = computed(() => pages.value.length)
const currentChapter = ref(chapterNumber)
const hasPreviousChapter = computed(() => currentChapter.value > 1)
const hasNextChapter = computed(() => {
  const lastChapter = chapters.value[chapters.value.length - 1].number
  return currentChapter.value < lastChapter
})

// Methods
const handleMouseMove = () => {
  hideControls.value = false
  clearTimeout(hideControlsTimeout)
  hideControlsTimeout = setTimeout(() => {
    hideControls.value = true
  }, 3000)
}

const handleClick = (e: MouseEvent) => {
  if (readingMode.value === 'single') {
    const clickX = e.clientX
    const windowWidth = window.innerWidth

    if (clickX < windowWidth / 3) {
      previousPage()
    } else if (clickX > (windowWidth * 2) / 3) {
      nextPage()
    }
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  } else if (hasPreviousChapter.value) {
    previousChapter()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  } else if (hasNextChapter.value) {
    nextChapter()
  }
}

const changeChapter = () => {
  router.push('/manga/' + mangaId + '/chapter/' + currentChapter.value)
}

const previousChapter = () => {
  if (hasPreviousChapter.value) {
    router.push('/manga/' + mangaId + '/chapter/' + (currentChapter.value - 1))
  }
}

const nextChapter = () => {
  if (hasNextChapter.value) {
    router.push('/manga/' + mangaId + '/chapter/' + (currentChapter.value + 1))
  }
}

// Lifecycle
onMounted(() => {
  // Hide controls after 3 seconds
  hideControlsTimeout = setTimeout(() => {
    hideControls.value = true
  }, 3000)

  // Close settings when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.settings-menu')) {
      showSettings.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)

  // Keyboard navigation
  const handleKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (readingMode.value === 'single') {
          previousPage()
        }
        break
      case 'ArrowRight':
        if (readingMode.value === 'single') {
          nextPage()
        }
        break
      case 'ArrowUp':
        if (readingMode.value === 'vertical') {
          window.scrollBy(0, -100)
        }
        break
      case 'ArrowDown':
        if (readingMode.value === 'vertical') {
          window.scrollBy(0, 100)
        }
        break
    }
  }
  document.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    clearTimeout(hideControlsTimeout)
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
.snap-x {
  scroll-snap-type: x mandatory;
}

.snap-center {
  scroll-snap-align: center;
}

/* Hide scrollbar */
.overflow-x-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style> 