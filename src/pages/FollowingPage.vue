<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Theo dõi</h1>
        <p class="text-gray-400">Quản lý danh sách manga bạn đang theo dõi</p>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-700 mb-8">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
              activeTab === tab.id
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
            <span
              class="ml-2 py-0.5 px-2 rounded-full text-xs"
              :class="activeTab === tab.id ? 'bg-red-500/10 text-red-500' : 'bg-gray-800 text-gray-400'"
            >
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Filter and Sort -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-4">
          <select
            v-model="filter.status"
            class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ongoing">Đang tiến hành</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
          <select
            v-model="filter.sort"
            class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="latest">Mới cập nhật</option>
            <option value="name">Tên A-Z</option>
            <option value="added">Thời gian thêm</option>
          </select>
        </div>
        <div class="relative">
          <input
            v-model="filter.search"
            type="text"
            placeholder="Tìm trong danh sách..."
            class="w-full sm:w-64 bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <!-- Reading List -->
      <div v-if="activeTab === 'reading'" class="space-y-4">
        <div
          v-for="manga in readingList"
          :key="manga.id"
          class="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors duration-200"
        >
          <div class="flex items-start p-4 gap-4">
            <!-- Cover -->
            <router-link
              :to="`/manga/${manga.id}`"
              class="shrink-0 w-20 sm:w-24"
            >
              <div class="aspect-[3/4] rounded overflow-hidden">
                <img
                  :src="manga.cover"
                  :alt="manga.title"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </router-link>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <router-link
                    :to="`/manga/${manga.id}`"
                    class="text-lg font-medium text-white hover:text-red-500 transition-colors duration-200"
                  >
                    {{ manga.title }}
                  </router-link>
                  <div class="mt-1 flex items-center gap-3 text-sm text-gray-400">
                    <span>{{ manga.latestChapter }} chapters</span>
                    <span>{{ manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành' }}</span>
                  </div>
                </div>
                <button
                  @click="toggleFollow(manga.id)"
                  class="shrink-0 text-red-500 hover:text-red-400"
                >
                  <i class="fas fa-heart text-xl"></i>
                </button>
              </div>

              <!-- Reading Progress -->
              <div class="mt-4">
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-gray-400">Tiến độ đọc</span>
                  <span class="text-white">{{ manga.readChapter }}/{{ manga.latestChapter }}</span>
                </div>
                <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-red-500 rounded-full"
                    :style="`width: ${(manga.readChapter / manga.latestChapter * 100)}%`"
                  ></div>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-4 flex items-center gap-4">
                <router-link
                  :to="`/manga/${manga.id}/chapter/${manga.readChapter + 1}`"
                  class="inline-flex items-center text-white bg-red-500 rounded-lg px-4 py-2 hover:bg-red-600"
                >
                  <i class="fas fa-book-reader mr-2"></i>
                  Đọc tiếp
                </router-link>
                <button class="text-gray-400 hover:text-white">
                  <i class="fas fa-history mr-2"></i>
                  Lịch sử đọc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Plan to Read -->
      <div v-if="activeTab === 'plan'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div
          v-for="manga in planToRead"
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

      <!-- Completed -->
      <div v-if="activeTab === 'completed'" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div
          v-for="manga in completedList"
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
              <div class="absolute top-2 right-2">
                <div class="flex items-center bg-green-500 rounded-full px-2 py-1">
                  <i class="fas fa-check text-xs mr-1"></i>
                  <span class="text-xs font-medium">Đã đọc xong</span>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div class="flex items-center gap-2 text-sm">
                  <span class="text-white">{{ manga.completedAt }}</span>
                </div>
              </div>
            </div>
            <h3 class="font-medium text-white group-hover:text-red-500 transition-colors duration-300 line-clamp-2">
              {{ manga.title }}
            </h3>
            <div class="flex items-center gap-3 mt-1 text-sm text-gray-400">
              <div class="flex items-center">
                <i class="fas fa-clock mr-1"></i>
                <span>{{ manga.readTime }}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-star text-yellow-400 mr-1"></i>
                <span>{{ manga.rating.toFixed(1) }}</span>
              </div>
            </div>
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

      <!-- Empty State -->
      <div
        v-if="!loading && getCurrentList.length === 0"
        class="text-center py-12"
      >
        <i class="fas fa-heart text-4xl text-gray-600 mb-4"></i>
        <h3 class="text-xl font-medium text-white mb-2">Chưa có manga nào</h3>
        <p class="text-gray-400">
          Hãy thêm manga vào danh sách theo dõi của bạn
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Tabs
const tabs = [
  { id: 'reading', name: 'Đang đọc', count: 12 },
  { id: 'plan', name: 'Dự định đọc', count: 8 },
  { id: 'completed', name: 'Đã hoàn thành', count: 24 }
]
const activeTab = ref('reading')

// Filter state
const filter = ref({
  status: '',
  sort: 'latest',
  search: ''
})

// Mock data
const readingList = ref([
  {
    id: '1',
    title: 'One Piece',
    cover: 'https://example.com/images/manga/one-piece.jpg',
    status: 'ongoing',
    latestChapter: 1089,
    readChapter: 1080,
    views: 1234567,
    rating: 4.9
  },
  {
    id: '2',
    title: 'Naruto',
    cover: 'https://example.com/images/manga/naruto.jpg',
    status: 'completed',
    latestChapter: 700,
    readChapter: 450,
    views: 987654,
    rating: 4.8
  }
])

const planToRead = ref([
  {
    id: '3',
    title: 'Dragon Ball',
    cover: 'https://example.com/images/manga/dragon-ball.jpg',
    status: 'completed',
    latestChapter: 519,
    updatedAt: '3 giờ trước',
    views: 876543,
    rating: 4.7
  },
  {
    id: '4',
    title: 'Bleach',
    cover: 'https://example.com/images/manga/bleach.jpg',
    status: 'completed',
    latestChapter: 686,
    updatedAt: '4 giờ trước',
    views: 765432,
    rating: 4.6
  }
])

const completedList = ref([
  {
    id: '5',
    title: 'Death Note',
    cover: 'https://example.com/images/manga/death-note.jpg',
    completedAt: '2 tháng trước',
    readTime: '3 ngày',
    rating: 4.9
  },
  {
    id: '6',
    title: 'Fullmetal Alchemist',
    cover: 'https://example.com/images/manga/fma.jpg',
    completedAt: '3 tháng trước',
    readTime: '5 ngày',
    rating: 4.8
  }
])

const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// Format number helper
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Get current list based on active tab
const getCurrentList = computed(() => {
  switch (activeTab.value) {
    case 'reading':
      return readingList.value
    case 'plan':
      return planToRead.value
    case 'completed':
      return completedList.value
    default:
      return []
  }
})

// Toggle follow status
const toggleFollow = (mangaId: string) => {
  // Implement unfollow logic
  console.log('Unfollow manga:', mangaId)
}

// Load more items
const loadMore = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add mock data based on active tab
    switch (activeTab.value) {
      case 'reading':
        readingList.value.push({
          id: '7',
          title: 'Black Clover',
          cover: 'https://example.com/images/manga/black-clover.jpg',
          status: 'ongoing',
          latestChapter: 350,
          readChapter: 340,
          views: 654321,
          rating: 4.5
        })
        break
      case 'plan':
        planToRead.value.push({
          id: '8',
          title: 'Jujutsu Kaisen',
          cover: 'https://example.com/images/manga/jjk.jpg',
          status: 'ongoing',
          latestChapter: 200,
          updatedAt: '5 giờ trước',
          views: 543210,
          rating: 4.7
        })
        break
      case 'completed':
        completedList.value.push({
          id: '9',
          title: 'Demon Slayer',
          cover: 'https://example.com/images/manga/demon-slayer.jpg',
          completedAt: '4 tháng trước',
          readTime: '4 ngày',
          rating: 4.7
        })
        break
    }
    
    page.value++
    hasMore.value = page.value < 5
  } catch (error) {
    console.error('Error loading more items:', error)
  } finally {
    loading.value = false
  }
}
</script> 