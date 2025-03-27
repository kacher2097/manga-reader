<template>
  <div class="pt-header">
    <div class="max-w-container mx-auto px-4 py-12">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">Kết quả tìm kiếm</h1>
        <div class="flex items-center gap-4">
          <div class="relative flex-1 max-w-xl">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm manga..."
              class="w-full px-4 py-3 pr-12 bg-background-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="search"
            >
            <button 
              class="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary"
              @click="search"
            >
              <i class="i-heroicons-magnifying-glass-20-solid" />
            </button>
          </div>
          <button 
            class="btn bg-background-light hover:bg-background"
            @click="showAdvancedSearch = !showAdvancedSearch"
          >
            <i class="i-heroicons-adjustments-horizontal-20-solid" />
            <span class="ml-2">Tìm kiếm nâng cao</span>
          </button>
        </div>
      </div>

      <!-- Advanced Search -->
      <div 
        v-show="showAdvancedSearch"
        class="bg-background-light rounded-lg p-6 mb-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Categories -->
          <div>
            <h3 class="font-bold mb-4">Thể loại</h3>
            <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              <label 
                v-for="category in categories"
                :key="category.id"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input 
                  type="checkbox"
                  v-model="filters.categories"
                  :value="category.id"
                  class="accent-primary"
                >
                <span>{{ category.name }}</span>
              </label>
            </div>
          </div>

          <!-- Status & Type -->
          <div class="space-y-6">
            <div>
              <h3 class="font-bold mb-4">Trạng thái</h3>
              <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    v-model="filters.ongoing"
                    class="accent-primary"
                  >
                  <span>Đang cập nhật</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    v-model="filters.completed"
                    class="accent-primary"
                  >
                  <span>Đã hoàn thành</span>
                </label>
              </div>
            </div>
            <div>
              <h3 class="font-bold mb-4">Loại</h3>
              <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio"
                    v-model="filters.type"
                    value="manga"
                    class="accent-primary"
                  >
                  <span>Manga</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio"
                    v-model="filters.type"
                    value="manhwa"
                    class="accent-primary"
                  >
                  <span>Manhwa</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio"
                    v-model="filters.type"
                    value="manhua"
                    class="accent-primary"
                  >
                  <span>Manhua</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Sort & Order -->
          <div class="space-y-6">
            <div>
              <h3 class="font-bold mb-4">Sắp xếp theo</h3>
              <select 
                v-model="filters.sort"
                class="w-full bg-background rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="relevance">Độ phù hợp</option>
                <option value="latest">Mới cập nhật</option>
                <option value="views">Lượt xem</option>
                <option value="rating">Đánh giá</option>
              </select>
            </div>
            <div>
              <h3 class="font-bold mb-4">Thứ tự</h3>
              <select 
                v-model="filters.order"
                class="w-full bg-background rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="desc">Giảm dần</option>
                <option value="asc">Tăng dần</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <template v-if="loading">
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </template>
      <template v-else-if="searchResults.length > 0">
        <div class="mb-6 text-gray-400">
          Tìm thấy {{ totalResults }} kết quả cho "{{ searchQuery }}"
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <manga-card
            v-for="manga in searchResults"
            :key="manga.id"
            :manga="manga"
          />
        </div>
        <!-- Pagination -->
        <div class="flex justify-center mt-12">
          <div class="flex items-center gap-2">
            <button 
              class="w-10 h-10 flex items-center justify-center rounded-lg bg-background-light hover:bg-background disabled:opacity-50"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <i class="i-heroicons-chevron-left-20-solid" />
            </button>
            <button 
              v-for="page in totalPages"
              :key="page"
              class="w-10 h-10 flex items-center justify-center rounded-lg"
              :class="page === currentPage ? 'bg-primary text-white' : 'bg-background-light hover:bg-background'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button 
              class="w-10 h-10 flex items-center justify-center rounded-lg bg-background-light hover:bg-background disabled:opacity-50"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <i class="i-heroicons-chevron-right-20-solid" />
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <h2 class="text-2xl font-bold mb-2">Không tìm thấy kết quả</h2>
          <p class="text-gray-400">
            Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MangaCard from '../components/ui/MangaCard.vue'

interface Manga {
  id: string
  title: string
  coverImage: string
  status: 'ongoing' | 'completed'
  latestChapter: number
  rating: number
  views: number
}

const route = useRoute()
const router = useRouter()

// Mock data
const categories = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 3, name: 'Comedy' },
  { id: 4, name: 'Drama' },
  { id: 5, name: 'Fantasy' },
  { id: 6, name: 'Horror' },
  { id: 7, name: 'Romance' },
  { id: 8, name: 'Sci-fi' }
]

const searchResults = ref<Manga[]>([])

// State
const searchQuery = ref('')
const showAdvancedSearch = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const totalResults = ref(0)
const totalPages = ref(1)

const filters = ref({
  categories: [],
  ongoing: false,
  completed: false,
  type: 'manga',
  sort: 'relevance',
  order: 'desc',
})

// Methods
const search = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true
  router.push({
    path: '/search',
    query: {
      q: searchQuery.value,
      page: currentPage.value.toString(),
      categories: filters.value.categories,
      ongoing: filters.value.ongoing.toString(),
      completed: filters.value.completed.toString(),
      type: filters.value.type,
      sort: filters.value.sort,
      order: filters.value.order,
    },
  })

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock results
  searchResults.value = [
    {
      id: '1',
      title: 'One Piece',
      coverImage: '/manga/one-piece.jpg',
      status: 'ongoing',
      latestChapter: 1089,
      rating: 4.9,
      views: 1500000,
    },
    // Add more results...
  ]
  totalResults.value = 100
  totalPages.value = 5
  loading.value = false
}

// Lifecycle
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q as string
    search()
  }
})
</script> 