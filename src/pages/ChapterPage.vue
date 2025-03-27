<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation Bar -->
    <div class="fixed top-0 left-0 right-0 bg-gray-800 z-50">
      <div class="container mx-auto px-4">
        <div class="h-16 flex items-center justify-between">
          <!-- Manga Info -->
          <div class="flex items-center">
            <router-link :to="`/manga/${mangaId}`" class="text-white hover:text-red-500 transition-colors">
              <i class="fas fa-arrow-left mr-2"></i>
              {{ mangaTitle }}
            </router-link>
            <span class="mx-2 text-gray-500">|</span>
            <span class="text-gray-300">Chapter {{ chapterNumber }}</span>
          </div>

          <!-- Chapter Navigation -->
          <div class="flex items-center space-x-4">
            <button 
              @click="prevChapter"
              :disabled="!hasPrevChapter"
              :class="[
                'px-4 py-2 rounded transition-colors',
                hasPrevChapter ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 cursor-not-allowed'
              ]"
            >
              <i class="fas fa-chevron-left mr-2"></i>
              Chương trước
            </button>
            <select 
              v-model="currentChapter"
              @change="changeChapter"
              class="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option v-for="chapter in chapters" :key="chapter.id" :value="chapter.id">
                Chapter {{ chapter.number }}
              </option>
            </select>
            <button 
              @click="nextChapter"
              :disabled="!hasNextChapter"
              :class="[
                'px-4 py-2 rounded transition-colors',
                hasNextChapter ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 cursor-not-allowed'
              ]"
            >
              Chương sau
              <i class="fas fa-chevron-right ml-2"></i>
            </button>
          </div>

          <!-- Settings -->
          <div class="flex items-center space-x-4">
            <button @click="toggleReadingMode" class="text-white hover:text-red-500 transition-colors">
              <i :class="['fas', isVerticalMode ? 'fa-arrows-alt-v' : 'fa-arrows-alt-h']"></i>
            </button>
            <button @click="toggleSettings" class="text-white hover:text-red-500 transition-colors">
              <i class="fas fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Chapter Content -->
    <div class="pt-16">
      <div 
        :class="[
          'container mx-auto px-4 py-8',
          { 'space-y-4': !isVerticalMode }
        ]"
      >
        <div 
          v-for="(page, index) in pages" 
          :key="index"
          :class="[
            'mx-auto',
            { 'max-w-4xl': !isVerticalMode }
          ]"
        >
          <img 
            :src="page"
            :alt="`Page ${index + 1}`"
            class="w-full h-auto"
            @click="toggleFullscreen(index)"
          />
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                  isVerticalMode ? 'bg-red-500' : 'bg-gray-700'
                ]"
              >
                <i class="fas fa-arrows-alt-v mr-2"></i>
                Dọc
              </button>
              <button 
                @click="isVerticalMode = false"
                :class="[
                  'px-4 py-2 rounded transition-colors',
                  !isVerticalMode ? 'bg-red-500' : 'bg-gray-700'
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
            <select class="w-full bg-gray-700 text-white px-4 py-2 rounded">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Mock data
const mangaId = 'one-piece'
const mangaTitle = 'One Piece'
const chapterNumber = 1089
const chapters = [
  { id: '1089', number: 1089 },
  { id: '1088', number: 1088 },
  { id: '1087', number: 1087 },
]
const pages = [
  'https://picsum.photos/800/1200?random=1',
  'https://picsum.photos/800/1200?random=2',
  'https://picsum.photos/800/1200?random=3',
  'https://picsum.photos/800/1200?random=4',
  'https://picsum.photos/800/1200?random=5',
]

// State
const currentChapter = ref(chapters[0].id)
const isVerticalMode = ref(true)
const showSettings = ref(false)

// Computed
const hasPrevChapter = computed(() => {
  const index = chapters.findIndex(c => c.id === currentChapter.value)
  return index < chapters.length - 1
})

const hasNextChapter = computed(() => {
  const index = chapters.findIndex(c => c.id === currentChapter.value)
  return index > 0
})

// Methods
const prevChapter = () => {
  if (!hasPrevChapter.value) return
  const index = chapters.findIndex(c => c.id === currentChapter.value)
  router.push(`/manga/${mangaId}/chapter/${chapters[index + 1].id}`)
}

const nextChapter = () => {
  if (!hasNextChapter.value) return
  const index = chapters.findIndex(c => c.id === currentChapter.value)
  router.push(`/manga/${mangaId}/chapter/${chapters[index - 1].id}`)
}

const changeChapter = () => {
  router.push(`/manga/${mangaId}/chapter/${currentChapter.value}`)
}

const toggleReadingMode = () => {
  isVerticalMode.value = !isVerticalMode.value
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const toggleFullscreen = (index: number) => {
  // Implement fullscreen view logic
}
</script> 