<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Quản lý danh mục</h1>
      <button
        @click="showAddModal = true"
        class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
      >
        <i class="fas fa-plus mr-2"></i>
        Thêm danh mục
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="flex items-center space-x-4">
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm danh mục..."
          class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg pl-10"
        />
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
      <select
        v-model="sortBy"
        class="bg-gray-700 text-white px-4 py-2 rounded-lg"
      >
        <option value="name">Tên A-Z</option>
        <option value="-name">Tên Z-A</option>
        <option value="mangaCount">Số manga (Tăng)</option>
        <option value="-mangaCount">Số manga (Giảm)</option>
      </select>
    </div>

    <!-- Categories Table -->
    <div class="bg-gray-800 rounded-lg overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-700">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Tên danh mục
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Slug
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Số manga
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
            v-for="category in filteredCategories"
            :key="category.id"
            class="hover:bg-gray-700/50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-white">{{ category.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-400">
              {{ category.slug }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
                {{ category.mangaCount }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-400">
              {{ formatDate(category.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editCategory(category)"
                class="text-blue-400 hover:text-blue-300 transition-colors mr-3"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="confirmDelete(category)"
                class="text-red-400 hover:text-red-300 transition-colors"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-white mb-4">
          {{ showEditModal ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">
              Tên danh mục
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">
              Slug
            </label>
            <input
              v-model="form.slug"
              type="text"
              required
              class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              {{ showEditModal ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>
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
          Bạn có chắc chắn muốn xóa danh mục "{{ selectedCategory?.name }}"?
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
            @click="deleteCategory"
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

interface Category {
  id: string
  name: string
  slug: string
  mangaCount: number
  createdAt: string
}

// Sample data
const categories = ref<Category[]>([
  {
    id: '1',
    name: 'Action',
    slug: 'action',
    mangaCount: 156,
    createdAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Adventure',
    slug: 'adventure',
    mangaCount: 142,
    createdAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '3',
    name: 'Comedy',
    slug: 'comedy',
    mangaCount: 198,
    createdAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '4',
    name: 'Drama',
    slug: 'drama',
    mangaCount: 167,
    createdAt: '2024-03-15T10:30:00Z'
  }
])

const searchQuery = ref('')
const sortBy = ref('name')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedCategory = ref<Category | null>(null)
const form = ref({
  name: '',
  slug: ''
})

const filteredCategories = computed(() => {
  let result = [...categories.value]
  
  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(category => 
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query)
    )
  }
  
  // Sort
  const [field, order] = sortBy.value.startsWith('-') 
    ? [sortBy.value.slice(1), 'desc']
    : [sortBy.value, 'asc']
    
  result.sort((a, b) => {
    const aValue = a[field as keyof Category]
    const bValue = b[field as keyof Category]
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })
  
  return result
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const editCategory = (category: Category) => {
  selectedCategory.value = category
  form.value = {
    name: category.name,
    slug: category.slug
  }
  showEditModal.value = true
}

const confirmDelete = (category: Category) => {
  selectedCategory.value = category
  showDeleteModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedCategory.value = null
  form.value = {
    name: '',
    slug: ''
  }
}

const handleSubmit = () => {
  if (showEditModal.value && selectedCategory.value) {
    // Update category
    const index = categories.value.findIndex(c => c.id === selectedCategory.value?.id)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        ...form.value
      }
    }
  } else {
    // Add new category
    categories.value.push({
      id: Math.random().toString(36).substr(2, 9),
      ...form.value,
      mangaCount: 0,
      createdAt: new Date().toISOString()
    })
  }
  closeModal()
}

const deleteCategory = () => {
  if (selectedCategory.value) {
    categories.value = categories.value.filter(c => c.id !== selectedCategory.value?.id)
    showDeleteModal.value = false
    selectedCategory.value = null
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