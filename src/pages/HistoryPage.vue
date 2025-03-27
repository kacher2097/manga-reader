<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Lịch sử đọc</h1>
        <p class="text-gray-400">Xem lại những manga bạn đã đọc gần đây</p>
      </div>

      <!-- Filter and Sort -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-4">
          <select
            v-model="filter.time"
            class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="yesterday">Hôm qua</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="clearHistory"
            class="text-red-500 hover:text-red-400"
          >
            <i class="fas fa-trash-alt mr-2"></i>
            Xóa lịch sử
          </button>
        </div>
      </div>

      <!-- History List -->
      <div class="space-y-6">
        <!-- Today -->
        <div v-if="todayHistory.length > 0">
          <h2 class="text-xl font-semibold text-white mb-4">Hôm nay</h2>
          <div class="space-y-4">
            <div
              v-for="item in todayHistory"
              :key="item.id"
              class="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors duration-200"
            >
              <div class="flex items-start p-4 gap-4">
                <!-- Cover -->
                <router-link
                  :to="`/manga/${item.manga.id}`"
                  class="shrink-0 w-20 sm:w-24"
                >
                  <div class="aspect-[3/4] rounded overflow-hidden">
                    <img
                      :src="item.manga.cover"
                      :alt="item.manga.title"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </router-link>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <router-link
                        :to="`/manga/${item.manga.id}`"
                        class="text-lg font-medium text-white hover:text-red-500 transition-colors duration-200"
                      >
                        {{ item.manga.title }}
                      </router-link>
                      <div class="mt-1 flex items-center gap-3 text-sm text-gray-400">
                        <router-link
                          :to="`/manga/${item.manga.id}/chapter/${item.chapter}`"
                          class="text-red-500 hover:text-red-400"
                        >
                          Chapter {{ item.chapter }}
                        </router-link>
                        <span>{{ item.readAt }}</span>
                      </div>
                    </div>
                    <button
                      @click="removeFromHistory(item.id)"
                      class="shrink-0 text-gray-400 hover:text-red-500"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>

                  <!-- Progress -->
                  <div class="mt-4">
                    <div class="flex items-center justify-between text-sm mb-2">
                      <span class="text-gray-400">Tiến độ đọc</span>
                      <span class="text-white">{{ item.progress }}%</span>
                    </div>
                    <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-red-500 rounded-full"
                        :style="`width: ${item.progress}%`"
                      ></div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="mt-4 flex items-center gap-4">
                    <router-link
                      :to="`/manga/${item.manga.id}/chapter/${item.chapter}`"
                      class="inline-flex items-center text-white bg-red-500 rounded-lg px-4 py-2 hover:bg-red-600"
                    >
                      <i class="fas fa-book-reader mr-2"></i>
                      Đọc tiếp
                    </router-link>
                    <router-link
                      :to="`/manga/${item.manga.id}`"
                      class="text-gray-400 hover:text-white"
                    >
                      <i class="fas fa-info-circle mr-2"></i>
                      Chi tiết manga
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Yesterday -->
        <div v-if="yesterdayHistory.length > 0">
          <h2 class="text-xl font-semibold text-white mb-4">Hôm qua</h2>
          <div class="space-y-4">
            <div
              v-for="item in yesterdayHistory"
              :key="item.id"
              class="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors duration-200"
            >
              <!-- Similar structure as today's items -->
              <div class="flex items-start p-4 gap-4">
                <!-- Cover -->
                <router-link
                  :to="`/manga/${item.manga.id}`"
                  class="shrink-0 w-20 sm:w-24"
                >
                  <div class="aspect-[3/4] rounded overflow-hidden">
                    <img
                      :src="item.manga.cover"
                      :alt="item.manga.title"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </router-link>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <router-link
                        :to="`/manga/${item.manga.id}`"
                        class="text-lg font-medium text-white hover:text-red-500 transition-colors duration-200"
                      >
                        {{ item.manga.title }}
                      </router-link>
                      <div class="mt-1 flex items-center gap-3 text-sm text-gray-400">
                        <router-link
                          :to="`/manga/${item.manga.id}/chapter/${item.chapter}`"
                          class="text-red-500 hover:text-red-400"
                        >
                          Chapter {{ item.chapter }}
                        </router-link>
                        <span>{{ item.readAt }}</span>
                      </div>
                    </div>
                    <button
                      @click="removeFromHistory(item.id)"
                      class="shrink-0 text-gray-400 hover:text-red-500"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>

                  <!-- Progress -->
                  <div class="mt-4">
                    <div class="flex items-center justify-between text-sm mb-2">
                      <span class="text-gray-400">Tiến độ đọc</span>
                      <span class="text-white">{{ item.progress }}%</span>
                    </div>
                    <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-red-500 rounded-full"
                        :style="`width: ${item.progress}%`"
                      ></div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="mt-4 flex items-center gap-4">
                    <router-link
                      :to="`/manga/${item.manga.id}/chapter/${item.chapter}`"
                      class="inline-flex items-center text-white bg-red-500 rounded-lg px-4 py-2 hover:bg-red-600"
                    >
                      <i class="fas fa-book-reader mr-2"></i>
                      Đọc tiếp
                    </router-link>
                    <router-link
                      :to="`/manga/${item.manga.id}`"
                      class="text-gray-400 hover:text-white"
                    >
                      <i class="fas fa-info-circle mr-2"></i>
                      Chi tiết manga
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Older -->
        <div v-if="olderHistory.length > 0">
          <h2 class="text-xl font-semibold text-white mb-4">Cũ hơn</h2>
          <div class="space-y-4">
            <div
              v-for="item in olderHistory"
              :key="item.id"
              class="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors duration-200"
            >
              <!-- Similar structure as today's items -->
              <div class="flex items-start p-4 gap-4">
                <!-- Cover -->
                <router-link
                  :to="`/manga/${item.manga.id}`"
                  class="shrink-0 w-20 sm:w-24"
                >
                  <div class="aspect-[3/4] rounded overflow-hidden">
                    <img
                      :src="item.manga.cover"
                      :alt="item.manga.title"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </router-link>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <router-link
                        :to="`/manga/${item.manga.id}`"
                        class="text-lg font-medium text-white hover:text-red-500 transition-colors duration-200"
                      >
                        {{ item.manga.title }}
                      </router-link>
                      <div class="mt-1 flex items-center gap-3 text-sm text-gray-400">
                        <router-link
                          :to="`/manga/${item.manga.id}/chapter/${item.chapter}`"
                          class="text-red-500 hover:text-red-400"
                        >
                          Chapter {{ item.chapter }}
                        </router-link>
                        <span>{{ item.readAt }}</span>
                      </div>
                    </div>
                    <button
                      @click="removeFromHistory(item.id)"
                      class="shrink-0 text-gray-400 hover:text-red-500"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>

                  <!-- Progress -->
                  <div class="mt-4">
                    <div class="flex items-center justify-between text-sm mb-2">
                      <span class="text-gray-400">Tiến độ đọc</span>
                      <span class="text-white">{{ item.progress }}%</span>
                    </div>
                    <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-red-500 rounded-full"
                        :style="`width: ${item.progress}%`"
                      ></div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="mt-4 flex items-center gap-4">
                    <router-link
                      :to="`/manga/${item.manga.id}/chapter/${item.chapter}`"
                      class="inline-flex items-center text-white bg-red-500 rounded-lg px-4 py-2 hover:bg-red-600"
                    >
                      <i class="fas fa-book-reader mr-2"></i>
                      Đọc tiếp
                    </router-link>
                    <router-link
                      :to="`/manga/${item.manga.id}`"
                      class="text-gray-400 hover:text-white"
                    >
                      <i class="fas fa-info-circle mr-2"></i>
                      Chi tiết manga
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!loading && historyList.length === 0"
          class="text-center py-12"
        >
          <i class="fas fa-history text-4xl text-gray-600 mb-4"></i>
          <h3 class="text-xl font-medium text-white mb-2">Chưa có lịch sử đọc</h3>
          <p class="text-gray-400">
            Bạn chưa đọc manga nào gần đây
          </p>
          <router-link
            to="/categories"
            class="inline-flex items-center mt-4 text-red-500 hover:text-red-400"
          >
            <i class="fas fa-search mr-2"></i>
            Khám phá manga
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Filter state
const filter = ref({
  time: 'all'
})

// Mock data
const historyList = ref([
  {
    id: '1',
    manga: {
      id: '1',
      title: 'One Piece',
      cover: 'https://example.com/images/manga/one-piece.jpg'
    },
    chapter: 1089,
    progress: 75,
    readAt: '2 giờ trước'
  },
  {
    id: '2',
    manga: {
      id: '2',
      title: 'Naruto',
      cover: 'https://example.com/images/manga/naruto.jpg'
    },
    chapter: 700,
    progress: 100,
    readAt: '5 giờ trước'
  },
  {
    id: '3',
    manga: {
      id: '3',
      title: 'Dragon Ball',
      cover: 'https://example.com/images/manga/dragon-ball.jpg'
    },
    chapter: 519,
    progress: 30,
    readAt: 'Hôm qua'
  },
  {
    id: '4',
    manga: {
      id: '4',
      title: 'Bleach',
      cover: 'https://example.com/images/manga/bleach.jpg'
    },
    chapter: 686,
    progress: 60,
    readAt: '2 ngày trước'
  }
])

const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// Group history by time
const todayHistory = computed(() => {
  return historyList.value.filter(item => item.readAt.includes('giờ'))
})

const yesterdayHistory = computed(() => {
  return historyList.value.filter(item => item.readAt === 'Hôm qua')
})

const olderHistory = computed(() => {
  return historyList.value.filter(item => !item.readAt.includes('giờ') && item.readAt !== 'Hôm qua')
})

// Remove item from history
const removeFromHistory = (id: string) => {
  const index = historyList.value.findIndex(item => item.id === id)
  if (index !== -1) {
    historyList.value.splice(index, 1)
  }
}

// Clear all history
const clearHistory = () => {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử đọc?')) {
    historyList.value = []
  }
}

// Load more items
const loadMore = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock new data
    const newItems = [
      {
        id: '5',
        manga: {
          id: '5',
          title: 'Death Note',
          cover: 'https://example.com/images/manga/death-note.jpg'
        },
        chapter: 108,
        progress: 100,
        readAt: '3 ngày trước'
      },
      {
        id: '6',
        manga: {
          id: '6',
          title: 'Fullmetal Alchemist',
          cover: 'https://example.com/images/manga/fma.jpg'
        },
        chapter: 108,
        progress: 45,
        readAt: '4 ngày trước'
      }
    ]
    
    historyList.value.push(...newItems)
    page.value++
    hasMore.value = page.value < 5
  } catch (error) {
    console.error('Error loading more items:', error)
  } finally {
    loading.value = false
  }
}
</script> 