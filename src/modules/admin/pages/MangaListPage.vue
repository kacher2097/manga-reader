<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gray-800 rounded-lg p-5 shadow-md border border-gray-700">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-primary">Quản lý Manga</h1>
        <router-link 
          to="/admin/manga/create" 
          class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center transition-colors"
        >
          <i class="fas fa-plus mr-2"></i> Thêm manga mới
        </router-link>
      </div>
      <p class="text-gray-400 mt-1">Quản lý danh sách manga có trong hệ thống</p>
    </div>
    
    <!-- Search and filters -->
    <div class="bg-gray-800 rounded-lg p-5 shadow-md border border-gray-700">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Search -->
        <div class="relative flex-grow md:max-w-xs">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <i class="fas fa-search text-gray-500"></i>
          </span>
          <input 
            v-model="searchTerm"
            type="text" 
            placeholder="Tìm kiếm manga..." 
            class="w-full py-2 pl-10 pr-4 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:border-primary transition-colors"
          >
        </div>
        
        <!-- Category filter -->
        <div class="sm:w-40 min-w-40">
          <select 
            v-model="selectedCategory"
            class="w-full py-2 px-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Tất cả thể loại</option>
            <option 
              v-for="category in categories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <!-- Status filter -->
        <div class="sm:w-40 min-w-40">
          <select 
            v-model="selectedStatus"
            class="w-full py-2 px-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ONGOING">Đang tiến hành</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="DROPPED">Đã hủy</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Manga table -->
    <div class="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-700">
            <tr>
              <th 
                v-for="header in tableHeaders" 
                :key="header.key"
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors"
                @click="sortBy(header.key)"
              >
                {{ header.label }}
                <span v-if="sortColumn === header.key">
                  <i :class="[
                    sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down',
                    'ml-1'
                  ]"></i>
                </span>
                <span v-else>
                  <i class="fas fa-sort ml-1 text-gray-500"></i>
                </span>
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-for="manga in sortedManga" :key="manga.id" class="hover:bg-gray-750 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-md object-cover" :src="manga.coverImage" alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-white">{{ manga.title }}</div>
                    <div class="text-sm text-gray-400 truncate max-w-[200px]">{{ manga.alternativeTitles }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-for="(category, index) in manga.categories" :key="category.id" class="inline-block">
                  <span class="text-sm text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">{{ category.name }}</span>
                  <span v-if="index < manga.categories.length - 1" class="text-gray-500 mx-1">•</span>
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    manga.status === 'ONGOING' ? 'bg-green-900 text-green-300' :
                    manga.status === 'COMPLETED' ? 'bg-blue-900 text-blue-300' :
                    'bg-red-900 text-red-300'
                  ]"
                >
                  {{ formatStatus(manga.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ manga.totalChapters }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatDate(manga.updatedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex justify-end space-x-2">
                  <router-link :to="`/admin/manga/${manga.id}/chapters`" class="text-blue-400 hover:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-400/10 transition-colors">
                    <i class="fas fa-list-ul"></i>
                    <span class="ml-1">Chapters</span>
                  </router-link>
                  <router-link :to="`/admin/manga/${manga.id}/edit`" class="text-yellow-400 hover:text-yellow-300 px-2 py-1 rounded-md hover:bg-yellow-400/10 transition-colors">
                    <i class="fas fa-edit"></i>
                    <span class="ml-1">Sửa</span>
                  </router-link>
                  <button @click="confirmDelete(manga)" class="text-red-400 hover:text-red-300 px-2 py-1 rounded-md hover:bg-red-400/10 transition-colors">
                    <i class="fas fa-trash-alt"></i>
                    <span class="ml-1">Xóa</span>
                  </button>
                </div>
              </td>
            </tr>
            <!-- No results row -->
            <tr v-if="sortedManga.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-gray-400">
                <div class="flex flex-col items-center">
                  <i class="fas fa-search text-4xl mb-3 text-gray-600"></i>
                  <p class="text-lg">Không tìm thấy manga nào</p>
                  <p class="text-sm mt-1">Thử tìm kiếm với từ khóa khác hoặc thêm manga mới</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination here if needed -->
    </div>
    
    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-lg border border-gray-700">
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900 mb-4">
            <i class="fas fa-exclamation-triangle text-2xl text-red-400"></i>
          </div>
          <h3 class="text-xl font-medium text-white mb-1">Xác nhận xóa</h3>
          <p class="text-gray-400">
            Bạn có chắc chắn muốn xóa manga "<span class="text-white">{{ mangaToDelete?.title }}</span>"?
            <br>Hành động này không thể hoàn tác.
          </p>
        </div>
        <div class="flex justify-center space-x-4">
          <button 
            @click="showDeleteModal = false" 
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            @click="deleteManga" 
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
          >
            <i class="fas fa-trash-alt mr-2"></i> Xóa manga
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MangaService } from '@/services/manga.service'
import { CategoryService } from '@/services/category.service'
import { formatDate } from '@/utils/format'

// Data
const mangas = ref<any[]>([])
const categories = ref<any[]>([])
const searchTerm = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const sortColumn = ref('updatedAt')
const sortDirection = ref('desc')
const showDeleteModal = ref(false)
const mangaToDelete = ref<any>(null)

// Table headers
const tableHeaders = [
  { key: 'title', label: 'Tên Manga' },
  { key: 'categories', label: 'Thể loại' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'totalChapters', label: 'Số chương' },
  { key: 'updatedAt', label: 'Cập nhật' },
]

// Fetch data
onMounted(async () => {
  try {
    const [mangaData, categoryData] = await Promise.all([
      MangaService.getAll(),
      CategoryService.getAll()
    ])
    
    mangas.value = mangaData
    categories.value = categoryData
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

// Computed properties
const filteredManga = computed(() => {
  return mangas.value.filter(manga => {
    // Filter by search term
    const matchesSearch = searchTerm.value === '' || manga.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (manga.alternativeTitles && manga.alternativeTitles.toLowerCase().includes(searchTerm.value.toLowerCase()))
    
    // Filter by category
    const matchesCategory = selectedCategory.value === '' || manga.categories.some((cat: any) => cat.id === selectedCategory.value)
    
    // Filter by status
    const matchesStatus = selectedStatus.value === '' || manga.status === selectedStatus.value
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const sortedManga = computed(() => {
  return [...filteredManga.value].sort((a, b) => {
    // Safely access the property in question
    let aValue = a[sortColumn.value]
    let bValue = b[sortColumn.value]
    
    // Handle category sorting special case
    if (sortColumn.value === 'categories') {
      aValue = a.categories.length > 0 ? a.categories[0].name : ''
      bValue = b.categories.length > 0 ? b.categories[0].name : ''
    }
    
    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1
    
    // Compare based on value type
    if (typeof aValue === 'string') {
      const comparison = aValue.localeCompare(bValue)
      return sortDirection.value === 'asc' ? comparison : -comparison
    } else {
      const comparison = aValue - bValue
      return sortDirection.value === 'asc' ? comparison : -comparison
    }
  })
})

// Methods
const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const formatStatus = (status: string) => {
  switch (status) {
    case 'ONGOING':
      return 'Đang tiến hành'
    case 'COMPLETED':
      return 'Hoàn thành'
    case 'DROPPED':
      return 'Đã hủy'
    default:
      return status
  }
}

const confirmDelete = (manga: any) => {
  mangaToDelete.value = manga
  showDeleteModal.value = true
}

const deleteManga = async () => {
  if (!mangaToDelete.value) return
  
  try {
    await MangaService.delete(mangaToDelete.value.id)
    mangas.value = mangas.value.filter(m => m.id !== mangaToDelete.value.id)
    showDeleteModal.value = false
    mangaToDelete.value = null
  } catch (error) {
    console.error('Error deleting manga:', error)
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

.bg-primary\/90 {
  background-color: rgba(255, 107, 107, 0.9);
}

.border-primary {
  border-color: #FF6B6B;
}

.bg-gray-750 {
  background-color: #2D3748;
}
</style> 