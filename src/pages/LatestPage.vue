<template>
  <div class="pt-header">
    <div class="max-w-container mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">Mới cập nhật</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-400">Sắp xếp theo:</span>
          <select 
            v-model="sortBy"
            class="bg-background-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="latest">Mới nhất</option>
            <option value="views">Lượt xem</option>
            <option value="rating">Đánh giá</option>
          </select>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="bg-background-light rounded-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Status Filter -->
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

          <!-- Categories Filter -->
          <div>
            <h3 class="font-bold mb-4">Thể loại</h3>
            <div class="grid grid-cols-2 gap-2">
              <label 
                v-for="category in categories"
                :key="category.id"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input 
                  type="checkbox"
                  v-model="selectedCategories"
                  :value="category.id"
                  class="accent-primary"
                >
                <span>{{ category.name }}</span>
              </label>
            </div>
          </div>

          <!-- Release Year Filter -->
          <div>
            <h3 class="font-bold mb-4">Năm phát hành</h3>
            <select 
              v-model="filters.year"
              class="w-full bg-background rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tất cả</option>
              <option 
                v-for="year in years"
                :key="year"
                :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Manga Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <manga-card
          v-for="manga in sortedManga"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MangaCard from '../components/ui/MangaCard.vue'

// Mock data
const categories = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 3, name: 'Comedy' },
  { id: 4, name: 'Drama' },
  { id: 5, name: 'Fantasy' },
  { id: 6, name: 'Horror' },
  { id: 7, name: 'Romance' },
  { id: 8, name: 'Sci-fi' },
]

interface Manga {
  id: string;
  title: string;
  coverImage: string;
  status: 'ongoing' | 'completed';
  latestChapter: number;
  rating: number;
  views: number;
  year: number;
}

const manga: Manga[] = [
  {
    id: '1',
    title: 'One Piece',
    coverImage: '/manga/one-piece.jpg',
    status: 'ongoing',
    latestChapter: 1089,
    rating: 4.9,
    views: 1500000,
    year: 2023,
  },
  // Add more manga...
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

// State
const sortBy = ref('latest')
const currentPage = ref(1)
const selectedCategories = ref<number[]>([])
const filters = ref({
  ongoing: false,
  completed: false,
  year: '',
})

// Computed
const sortedManga = computed(() => {
  let result = [...manga]

  // Apply filters
  if (selectedCategories.value.length > 0) {
    // Filter by categories
  }
  if (filters.value.ongoing || filters.value.completed) {
    result = result.filter(m => {
      if (filters.value.ongoing && m.status === 'ongoing') return true
      if (filters.value.completed && m.status === 'completed') return true
      return false
    })
  }
  if (filters.value.year) {
    result = result.filter(m => m.year === parseInt(filters.value.year))
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'views':
      result.sort((a, b) => b.views - a.views)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'latest':
    default:
      result.sort((a, b) => b.latestChapter - a.latestChapter)
  }

  return result
})

const totalPages = computed(() => Math.ceil(sortedManga.value.length / 24))
</script> 