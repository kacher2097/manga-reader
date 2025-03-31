<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center space-x-3">
            <router-link
              to="/admin/manga"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <i class="fas fa-arrow-left"></i>
            </router-link>
            <h1 class="text-2xl font-bold text-white">Quản lý chapter</h1>
          </div>
          <div class="mt-1 text-gray-400">
            {{ manga?.title }}
          </div>
        </div>
        <router-link
          :to="`/admin/manga/${mangaId}/chapters/new`"
          class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Thêm chapter mới
        </router-link>
      </div>
  
      <!-- Search and Filter -->
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 relative min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm chapter..."
            class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg pl-10"
          />
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <select
          v-model="sortBy"
          class="bg-gray-700 text-white px-4 py-2 rounded-lg min-w-[150px]"
        >
          <option value="number">Số chapter (Thấp-Cao)</option>
          <option value="-number">Số chapter (Cao-Thấp)</option>
          <option value="createdAt">Ngày tạo (Cũ-Mới)</option>
          <option value="-createdAt">Ngày tạo (Mới-Cũ)</option>
          <option value="views">Lượt xem (Thấp-Cao)</option>
          <option value="-views">Lượt xem (Cao-Thấp)</option>
        </select>
      </div>
  
      <!-- Chapters Table -->
      <div class="bg-gray-800 rounded-lg overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-700">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Chapter
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Số trang
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Thống kê
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr
              v-for="chapter in filteredChapters"
              :key="chapter.id"
              class="hover:bg-gray-700/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-white font-medium">Chapter {{ chapter.number }}</div>
                <div class="text-gray-400 text-sm">ID: {{ chapter.id }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-white line-clamp-2">{{ chapter.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-white">{{ chapter.pages.length }} trang</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-4">
                  <div class="text-center">
                    <div class="text-white">{{ formatNumber(chapter.views) }}</div>
                    <div class="text-gray-400 text-xs">Lượt xem</div>
                  </div>
                  <div class="text-center">
                    <div class="text-white">{{ chapter.comments }}</div>
                    <div class="text-gray-400 text-xs">Bình luận</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-400">
                {{ formatDate(chapter.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <router-link
                  :to="`/admin/manga/${mangaId}/chapters/${chapter.id}/edit`"
                  class="text-blue-400 hover:text-blue-300 transition-colors mr-3"
                  title="Chỉnh sửa"
                >
                  <i class="fas fa-edit"></i>
                </router-link>
                <button
                  @click="confirmDelete(chapter)"
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
            Bạn có chắc chắn muốn xóa Chapter {{ selectedChapter?.number }}?
            Hành động này không thể hoàn tác.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button
              @click="deleteChapter"
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
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import type { Manga } from '@/services/api'
  
  interface Chapter {
    id: string
    mangaId: string
    number: number
    title: string
    pages: string[]
    views: number
    comments: number
    createdAt: string
  }
  
  const route = useRoute()
  const mangaId = route.params.id as string
  
  // Sample data
  const manga = ref<Manga>({
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
    updatedAt: Date.now()
  })
  
  const chapters = ref<Chapter[]>([
    {
      id: 'op-1089',
      mangaId: 'one-piece',
      number: 1089,
      title: 'The Weight of Memory',
      pages: Array(18).fill('https://example.com/page.jpg'),
      views: 125789,
      comments: 1234,
      createdAt: '2024-03-15T10:30:00Z'
    },
    {
      id: 'op-1088',
      mangaId: 'one-piece',
      number: 1088,
      title: 'Forces of Nature',
      pages: Array(16).fill('https://example.com/page.jpg'),
      views: 158963,
      comments: 1567,
      createdAt: '2024-03-08T10:30:00Z'
    },
    {
      id: 'op-1087',
      mangaId: 'one-piece',
      number: 1087,
      title: 'The Future of Wano',
      pages: Array(17).fill('https://example.com/page.jpg'),
      views: 187456,
      comments: 1789,
      createdAt: '2024-03-01T10:30:00Z'
    }
  ])
  
  const searchQuery = ref('')
  const sortBy = ref('-number')
  const showDeleteModal = ref(false)
  const selectedChapter = ref<Chapter | null>(null)
  
  const filteredChapters = computed(() => {
    let result = [...chapters.value]
    
    // Search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(chapter => 
        chapter.title.toLowerCase().includes(query) ||
        chapter.number.toString().includes(query)
      )
    }
    
    // Sort
    const [field, order] = sortBy.value.startsWith('-') 
      ? [sortBy.value.slice(1), 'desc']
      : [sortBy.value, 'asc']
      
    result.sort((a, b) => {
      const aValue = a[field as keyof Chapter]
      const bValue = b[field as keyof Chapter]
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })
    
    return result
  })
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const confirmDelete = (chapter: Chapter) => {
    selectedChapter.value = chapter
    showDeleteModal.value = true
  }
  
  const deleteChapter = () => {
    if (selectedChapter.value) {
      chapters.value = chapters.value.filter(c => c.id !== selectedChapter.value?.id)
      showDeleteModal.value = false
      selectedChapter.value = null
    }
  }
  
  onMounted(async () => {
    // TODO: Fetch manga and chapters data from API
  })
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