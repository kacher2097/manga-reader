<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Quản lý manga</h1>
      <router-link
        to="/admin/manga/new"
        class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
      >
        <i class="fas fa-plus mr-2"></i>
        Thêm manga mới
      </router-link>
    </div>

    <!-- Search and Filter -->
    <div class="flex flex-wrap gap-4">
      <div class="flex-1 relative min-w-[200px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm manga..."
          class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg pl-10"
        />
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
      <select
        v-model="statusFilter"
        class="bg-gray-700 text-white px-4 py-2 rounded-lg min-w-[150px]"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="ongoing">Đang tiến hành</option>
        <option value="completed">Đã hoàn thành</option>
        <option value="dropped">Đã drop</option>
      </select>
      <select
        v-model="categoryFilter"
        class="bg-gray-700 text-white px-4 py-2 rounded-lg min-w-[150px]"
      >
        <option value="">Tất cả thể loại</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <select
        v-model="sortBy"
        class="bg-gray-700 text-white px-4 py-2 rounded-lg min-w-[150px]"
      >
        <option value="title">Tên A-Z</option>
        <option value="-title">Tên Z-A</option>
        <option value="views">Lượt xem (Thấp-Cao)</option>
        <option value="-views">Lượt xem (Cao-Thấp)</option>
        <option value="rating">Đánh giá (Thấp-Cao)</option>
        <option value="-rating">Đánh giá (Cao-Thấp)</option>
        <option value="updatedAt">Cập nhật (Cũ-Mới)</option>
        <option value="-updatedAt">Cập nhật (Mới-Cũ)</option>
      </select>
    </div>

    <!-- Manga Table -->
    <div class="bg-gray-800 rounded-lg overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-700">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Manga
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Tác giả
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Trạng thái
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Chapter mới nhất
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Thống kê
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr
            v-for="manga in filteredMangas"
            :key="manga.id"
            class="hover:bg-gray-700/50 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <img
                  :src="manga.coverImage"
                  :alt="manga.title"
                  class="w-12 h-16 object-cover rounded"
                />
                <div>
                  <div class="text-white font-medium">{{ manga.title }}</div>
                  <div class="text-gray-400 text-sm">ID: {{ manga.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-400">
              {{ manga.author }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  manga.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                  manga.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                ]"
              >
                {{ formatStatus(manga.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-white">Chapter {{ manga.latestChapter }}</div>
              <div class="text-gray-400 text-sm">{{ formatTimeAgo(manga.updatedAt) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-4">
                <div class="text-center">
                  <div class="text-white">{{ formatNumber(manga.views) }}</div>
                  <div class="text-gray-400 text-xs">Lượt xem</div>
                </div>
                <div class="text-center">
                  <div class="text-white">{{ manga.rating.toFixed(1) }}</div>
                  <div class="text-gray-400 text-xs">Đánh giá</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link
                :to="`/admin/manga/${manga.id}/chapters`"
                class="text-blue-400 hover:text-blue-300 transition-colors mr-3"
                title="Quản lý chapter"
              >
                <i class="fas fa-list"></i>
              </router-link>
              <router-link
                :to="`/admin/manga/${manga.id}/edit`"
                class="text-yellow-400 hover:text-yellow-300 transition-colors mr-3"
                title="Chỉnh sửa"
              >
                <i class="fas fa-edit"></i>
              </router-link>
              <button
                @click="confirmDelete(manga)"
                class="text-red-400 hover:text-red-300 transition-colors"
                title="Xóa"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-white mb-4">
          Xác nhận xóa
        </h2>
        <p class="text-gray-400 mb-6">
          Bạn có chắc chắn muốn xóa manga "{{ selectedManga?.title }}"?
          Hành động này không thể hoàn tác và sẽ xóa tất cả chapter liên quan.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Hủy
          </button>
          <button
            @click="deleteManga"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Manga } from '@/services/api'

// Sample data
const categories = ref([
  { id: '1', name: 'Action' },
  { id: '2', name: 'Adventure' },
  { id: '3', name: 'Comedy' },
  { id: '4', name: 'Drama' }
])

const mangas = ref<Manga[]>([
  {
    id: 'one-piece',
    title: 'One Piece',
    description: 'Theo chân cuộc phiêu lưu của Monkey D. Luffy...',
    coverImage: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    status: 'ongoing',
    categories: ['Action', 'Adventure'],
    latestChapter: 1089,
    views: 1523789,
    rating: 4.8,
    author: 'Eiichiro Oda',
    artist: 'Eiichiro Oda',
    releaseYear: '1997',
    createdAt: Date.now(),
    updatedAt: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    description: 'Câu chuyện về Yuji Itadori...',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/211807.jpg',
    status: 'ongoing',
    categories: ['Action', 'Supernatural'],
    latestChapter: 235,
    views: 852963,
    rating: 4.6,
    author: 'Gege Akutami',
    artist: 'Gege Akutami',
    releaseYear: '2018',
    createdAt: Date.now(),
    updatedAt: Date.now() - 1000 * 60 * 60 * 5 // 5 hours ago
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    description: 'Denji là một thiếu niên nghèo...',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
    status: 'completed',
    categories: ['Action', 'Horror'],
    latestChapter: 154,
    views: 741852,
    rating: 4.7,
    author: 'Tatsuki Fujimoto',
    artist: 'Tatsuki Fujimoto',
    releaseYear: '2018',
    createdAt: Date.now(),
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
  }
])

const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const sortBy = ref('title')
const showDeleteModal = ref(false)
const selectedManga = ref<Manga | null>(null)

const filteredMangas = computed(() => {
  let result = [...mangas.value]
  
  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(manga => 
      manga.title.toLowerCase().includes(query) ||
      manga.author.toLowerCase().includes(query)
    )
  }
  
  // Status filter
  if (statusFilter.value) {
    result = result.filter(manga => manga.status === statusFilter.value)
  }
  
  // Sort
  const [field, order] = sortBy.value.startsWith('-') 
    ? [sortBy.value.slice(1), 'desc']
    : [sortBy.value, 'asc']
    
  result.sort((a, b) => {
    const aValue = a[field as keyof Manga]
    const bValue = b[field as keyof Manga]
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })
  
  return result
})

const formatStatus = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'Đang tiến hành'
    case 'completed':
      return 'Đã hoàn thành'
    case 'dropped':
      return 'Đã drop'
    default:
      return status
  }
}

const formatTimeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) {
    return 'vừa xong'
  }
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} phút trước`
  }
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} giờ trước`
  }
  
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const confirmDelete = (manga: Manga) => {
  selectedManga.value = manga
  showDeleteModal.value = true
}

const deleteManga = () => {
  if (selectedManga.value) {
    mangas.value = mangas.value.filter(m => m.id !== selectedManga.value?.id)
    showDeleteModal.value = false
    selectedManga.value = null
  }
}
</script>

<style scoped>
.text-primary {
  color: #FF6B6B;
}

.bg-primary {
  background-color: #FF6B6B;
}

.hover\:bg-primary-dark:hover {
  background-color: #FF5252;
}
</style> 