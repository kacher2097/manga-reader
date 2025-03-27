<template>
  <div class="pt-header">
    <div class="max-w-container mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">Truyện yêu thích</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-400">Sắp xếp theo:</span>
          <select 
            v-model="sortBy"
            class="bg-background-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="latest">Mới nhất</option>
            <option value="name">Tên truyện</option>
            <option value="lastRead">Đọc gần đây</option>
          </select>
        </div>
      </div>

      <template v-if="favorites.length > 0">
        <!-- Collections -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-6">
            <button
              v-for="collection in collections"
              :key="collection.id"
              class="px-4 py-2 rounded-full"
              :class="selectedCollection === collection.id ? 'bg-primary text-white' : 'bg-background-light hover:bg-background'"
              @click="selectedCollection = collection.id"
            >
              {{ collection.name }}
              <span class="text-sm ml-2">({{ collection.count }})</span>
            </button>
            <button
              class="px-4 py-2 rounded-full bg-background-light hover:bg-background"
              @click="showCreateCollection = true"
            >
              <i class="i-heroicons-plus-20-solid" />
              <span class="ml-2">Tạo bộ sưu tập</span>
            </button>
          </div>
        </div>

        <!-- Manga Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <manga-card
            v-for="manga in sortedFavorites"
            :key="manga.id"
            :manga="manga"
          >
            <template #actions>
              <button 
                class="btn bg-background-light hover:bg-background w-full flex items-center justify-center gap-2"
                @click="removeFavorite(manga)"
              >
                <i class="i-heroicons-heart-20-solid text-red-500" />
                Bỏ thích
              </button>
            </template>
          </manga-card>
        </div>
      </template>
      <template v-else>
        <div class="text-center py-12">
          <div class="text-6xl mb-4">💔</div>
          <h2 class="text-2xl font-bold mb-2">Chưa có truyện yêu thích</h2>
          <p class="text-gray-400 mb-6">
            Hãy thêm truyện vào danh sách yêu thích để đọc sau
          </p>
          <router-link to="/" class="btn btn-primary">
            Khám phá truyện
          </router-link>
        </div>
      </template>
    </div>

    <!-- Create Collection Modal -->
    <dialog
      :open="showCreateCollection"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @close="showCreateCollection = false"
    >
      <div class="bg-background-light rounded-lg p-6 w-full max-w-md">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold">Tạo bộ sưu tập mới</h3>
          <button
            class="text-gray-400 hover:text-white"
            @click="showCreateCollection = false"
          >
            <i class="i-heroicons-x-mark-20-solid" />
          </button>
        </div>
        <form @submit.prevent="createCollection">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                Tên bộ sưu tập
              </label>
              <input
                v-model="newCollectionName"
                type="text"
                required
                class="input"
                placeholder="Ví dụ: Đang đọc, Sẽ đọc sau,..."
              >
            </div>
          </div>
          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              class="btn bg-background hover:bg-background-light"
              @click="showCreateCollection = false"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <template v-if="loading">
                <i class="i-heroicons-arrow-path-20-solid animate-spin" />
                <span class="ml-2">Đang tạo...</span>
              </template>
              <span v-else>Tạo bộ sưu tập</span>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MangaCard from '../components/ui/MangaCard.vue'

// Định nghĩa kiểu MangaStatus
type MangaStatus = 'ongoing' | 'completed';

// Interface cho đối tượng manga
interface Manga {
  id: string;
  title: string;
  coverImage: string;
  status: MangaStatus;
  latestChapter: number;
  rating: number;
  views: number;
  addedAt: string;
  lastRead: string;
}

// Mock data
const collections = [
  { id: 'all', name: 'Tất cả', count: 42 },
  { id: 'reading', name: 'Đang đọc', count: 15 },
  { id: 'completed', name: 'Đã đọc xong', count: 27 },
]

const favorites = [
  {
    id: '1',
    title: 'One Piece',
    coverImage: '/manga/one-piece.jpg',
    status: 'ongoing' as MangaStatus,
    latestChapter: 1089,
    rating: 4.9,
    views: 1500000,
    addedAt: '2023-12-01',
    lastRead: '2023-12-15',
  },
  // Add more manga...
]

// State
const sortBy = ref('latest')
const selectedCollection = ref('all')
const showCreateCollection = ref(false)
const loading = ref(false)
const newCollectionName = ref('')

// Computed
const sortedFavorites = computed(() => {
  let result = [...favorites]

  // Filter by collection
  if (selectedCollection.value !== 'all') {
    // Implement collection filtering
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'name':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'lastRead':
      result.sort((a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime())
      break
    case 'latest':
    default:
      result.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
  }

  return result
})

// Methods
const removeFavorite = async (manga: any) => {
  if (!confirm(`Bạn có chắc muốn bỏ thích truyện "${manga.title}"?`)) return
  // Implement remove favorite logic
}

const createCollection = async () => {
  try {
    loading.value = true
    // Implement create collection logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    showCreateCollection.value = false
    newCollectionName.value = ''
  } finally {
    loading.value = false
  }
}
</script> 