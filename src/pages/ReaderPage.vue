<template>
  <div class="min-h-screen bg-black">
    <!-- Reader Header -->
    <header 
      class="fixed top-0 left-0 right-0 h-12 bg-background/95 backdrop-blur-sm z-50 transition-transform duration-300"
      :class="{ '-translate-y-full': hideUI }"
      @mouseenter="showUI"
    >
      <div class="h-full px-4 flex items-center justify-between gap-4">
        <!-- Back button -->
        <router-link 
          :to="'/manga/' + mangaId" 
          class="btn bg-background-light hover:bg-background"
        >
          <i class="i-heroicons-arrow-left-20-solid" />
          <span class="ml-2 hidden sm:inline">Quay lại</span>
        </router-link>

        <!-- Chapter Navigation -->
        <div class="flex items-center gap-2">
          <button 
            class="btn bg-background-light hover:bg-background"
            :disabled="!hasPrevChapter"
            @click="navigateChapter(-1)"
          >
            <i class="i-heroicons-chevron-left-20-solid" />
          </button>
          
          <select
            v-model="currentChapter"
            class="bg-background-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
          >
            <option 
              v-for="chapter in chapters"
              :key="chapter.id"
              :value="chapter.id"
            >
              Chapter {{ chapter.number }}
            </option>
          </select>

          <button 
            class="btn bg-background-light hover:bg-background"
            :disabled="!hasNextChapter"
            @click="navigateChapter(1)"
          >
            <i class="i-heroicons-chevron-right-20-solid" />
          </button>
        </div>

        <!-- Settings -->
        <div class="flex items-center gap-4">
          <!-- Reading Direction -->
          <button
            class="btn bg-background-light hover:bg-background hidden sm:flex"
            @click="toggleReadingDirection"
          >
            <i :class="isVertical ? 'i-heroicons-arrows-up-down-20-solid' : 'i-heroicons-arrows-right-left-20-solid'" />
            <span class="ml-2">{{ isVertical ? 'Dọc' : 'Ngang' }}</span>
          </button>

          <!-- Page Layout -->
          <button
            class="btn bg-background-light hover:bg-background hidden sm:flex"
            @click="togglePageLayout"
          >
            <i :class="singlePage ? 'i-heroicons-document-20-solid' : 'i-heroicons-document-duplicate-20-solid'" />
            <span class="ml-2">{{ singlePage ? '1 trang' : '2 trang' }}</span>
          </button>

          <!-- Settings Menu (Mobile) -->
          <button
            class="btn bg-background-light hover:bg-background sm:hidden"
            @click="showSettings = true"
          >
            <i class="i-heroicons-cog-6-tooth-20-solid" />
          </button>
        </div>
      </div>
    </header>

    <!-- Reader Content -->
    <main 
      class="min-h-screen pt-12 pb-16"
      @click="toggleUI"
    >
      <div 
        class="max-w-reader mx-auto px-4"
        :class="{
          'space-y-4': isVertical,
          'flex flex-wrap justify-center gap-4': !isVertical
        }"
      >
        <template v-if="loading">
          <div class="flex items-center justify-center min-h-[calc(100vh-7rem)]">
            <div class="animate-spin">
              <i class="i-heroicons-arrow-path-20-solid text-4xl" />
            </div>
          </div>
        </template>
        <template v-else>
          <img
            v-for="(page, index) in currentPages"
            :key="index"
            :src="page.url"
            :alt="'Page ' + (index + 1)"
            class="mx-auto"
            :class="{
              'max-h-[calc(100vh-7rem)]': !isVertical,
              'w-full': isVertical
            }"
            :style="{
              maxWidth: singlePage || isVertical ? '100%' : '50%'
            }"
            @load="handleImageLoad"
          >
        </template>
      </div>
    </main>

    <!-- Reader Footer -->
    <footer
      class="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm z-50 transition-transform duration-300"
      :class="{ 'translate-y-full': hideUI }"
      @mouseenter="showUI"
    >
      <div class="h-full px-4 flex items-center justify-between">
        <!-- Page Navigation -->
        <div class="flex items-center gap-4">
          <span class="text-gray-400">
            Trang {{ currentPageNumber }}/{{ totalPages }}
          </span>
          <input
            type="range"
            v-model="currentPageNumber"
            :min="1"
            :max="totalPages"
            class="w-48 accent-primary"
          >
        </div>

        <!-- Keyboard Shortcuts -->
        <div class="hidden sm:flex items-center gap-4 text-gray-400">
          <span>← Trang trước</span>
          <span>→ Trang sau</span>
          <span>Space Tự động cuộn</span>
        </div>
      </div>
    </footer>

    <!-- Settings Modal (Mobile) -->
    <dialog
      :open="showSettings"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      @close="showSettings = false"
    >
      <div class="bg-background-light rounded-t-lg sm:rounded-lg w-full sm:max-w-md">
        <div class="p-6 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold">Cài đặt</h3>
            <button
              class="text-gray-400 hover:text-white"
              @click="showSettings = false"
            >
              <i class="i-heroicons-x-mark-20-solid" />
            </button>
          </div>

          <!-- Reading Direction -->
          <div class="flex items-center justify-between">
            <span>Hướng đọc</span>
            <button
              class="btn bg-background hover:bg-background-light"
              @click="toggleReadingDirection"
            >
              <i :class="isVertical ? 'i-heroicons-arrows-up-down-20-solid' : 'i-heroicons-arrows-right-left-20-solid'" />
              <span class="ml-2">{{ isVertical ? 'Dọc' : 'Ngang' }}</span>
            </button>
          </div>

          <!-- Page Layout -->
          <div class="flex items-center justify-between">
            <span>Bố cục trang</span>
            <button
              class="btn bg-background hover:bg-background-light"
              @click="togglePageLayout"
            >
              <i :class="singlePage ? 'i-heroicons-document-20-solid' : 'i-heroicons-document-duplicate-20-solid'" />
              <span class="ml-2">{{ singlePage ? '1 trang' : '2 trang' }}</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Props from route
const mangaId = route.params.mangaId as string
const chapterId = route.params.chapterId as string

// Mock data
const chapters = [
  { id: '1', number: 1 },
  { id: '2', number: 2 },
  { id: '3', number: 3 },
  // Add more chapters...
]

const pages = [
  { url: '/manga/chapter-1/page-1.jpg' },
  { url: '/manga/chapter-1/page-2.jpg' },
  { url: '/manga/chapter-1/page-3.jpg' },
  // Add more pages...
]

// State
const loading = ref(true)
const currentChapter = ref(chapterId)
const currentPageNumber = ref(1)
const isVertical = ref(true)
const singlePage = ref(true)
const hideUI = ref(false)
const showSettings = ref(false)
const uiTimeout = ref<number | null>(null)

// Computed
const totalPages = computed(() => pages.length)

const hasPrevChapter = computed(() => {
  const index = chapters.findIndex(c => c.id === currentChapter.value)
  return index > 0
})

const hasNextChapter = computed(() => {
  const index = chapters.findIndex(c => c.id === currentChapter.value)
  return index < chapters.length - 1
})

const currentPages = computed(() => {
  const index = currentPageNumber.value - 1
  if (singlePage.value || isVertical.value) {
    return [pages[index]]
  }
  return [pages[index], pages[index + 1]].filter(Boolean)
})

// Methods
const navigateChapter = (delta: number) => {
  const index = chapters.findIndex(c => c.id === currentChapter.value)
  const nextChapter = chapters[index + delta]
  if (nextChapter) {
    router.push(`/manga/${mangaId}/chapter/${nextChapter.id}`)
  }
}

const toggleReadingDirection = () => {
  isVertical.value = !isVertical.value
  singlePage.value = isVertical.value
}

const togglePageLayout = () => {
  if (!isVertical.value) {
    singlePage.value = !singlePage.value
  }
}

const showUI = () => {
  hideUI.value = false
  if (uiTimeout.value) {
    clearTimeout(uiTimeout.value)
  }
}

const toggleUI = () => {
  hideUI.value = !hideUI.value
  if (!hideUI.value && !isVertical.value) {
    uiTimeout.value = window.setTimeout(() => {
      hideUI.value = true
    }, 3000)
  }
}

const handleImageLoad = () => {
  loading.value = false
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    if (currentPageNumber.value > 1) {
      currentPageNumber.value--
    } else if (hasPrevChapter.value) {
      navigateChapter(-1)
    }
  } else if (e.key === 'ArrowRight') {
    if (currentPageNumber.value < totalPages.value) {
      currentPageNumber.value++
    } else if (hasNextChapter.value) {
      navigateChapter(1)
    }
  } else if (e.key === ' ') {
    e.preventDefault()
    // Implement auto-scroll
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (uiTimeout.value) {
    clearTimeout(uiTimeout.value)
  }
})

// Watch
watch(currentChapter, (newChapterId) => {
  router.push(`/manga/${mangaId}/chapter/${newChapterId}`)
  currentPageNumber.value = 1
  loading.value = true
})

watch(currentPageNumber, (newPage) => {
  if (newPage === totalPages.value && hasNextChapter.value) {
    // Show next chapter prompt
  }
})
</script>

<style scoped>
.max-w-reader {
  max-width: 1400px;
}

/* Hide scrollbar but allow scrolling */
::-webkit-scrollbar {
  display: none;
}

/* Custom range input styling */
input[type="range"] {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}
</style>
