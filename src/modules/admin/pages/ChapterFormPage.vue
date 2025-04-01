<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center space-x-3">
          <router-link
            :to="`/admin/manga/${mangaId}/chapters`"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <i class="fas fa-arrow-left"></i>
          </router-link>
          <h1 class="text-2xl font-bold text-white">
            {{ isEditing ? 'Chỉnh sửa chapter' : 'Thêm chapter mới' }}
          </h1>
        </div>
        <div class="mt-1 text-gray-400">
          {{ manga?.title }}
        </div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Info -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-lg font-medium text-white mb-4">Thông tin chapter</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">
              Số chapter <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.number"
              type="number"
              required
              min="0"
              step="0.1"
              class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">
              Tiêu đề
            </label>
            <input
              v-model="form.title"
              type="text"
              class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              placeholder="Nhập tiêu đề chapter (nếu có)"
            />
          </div>
        </div>
      </div>

      <!-- Pages -->
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-white">Danh sách trang</h2>
          <div class="flex items-center space-x-3">
            <label class="text-gray-400">
              <input
                type="checkbox"
                v-model="autoNumbering"
                class="mr-2"
              />
              Đánh số tự động
            </label>
            <label
              class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <i class="fas fa-upload mr-2"></i>
              Tải lên nhiều trang
              <input
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleBulkUpload"
              />
            </label>
          </div>
        </div>

        <!-- Page List -->
        <div class="space-y-4">
          <div
            v-for="(page, index) in form.pages"
            :key="index"
            class="flex items-start space-x-4 bg-gray-700 p-4 rounded-lg group"
          >
            <!-- Preview -->
            <div class="relative w-24 h-32 flex-shrink-0">
              <img
                :src="page.url"
                :alt="`Page ${page.number}`"
                class="w-full h-full object-cover rounded"
              />
              <div
                class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <label class="cursor-pointer">
                  <i class="fas fa-edit text-white"></i>
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="e => handlePageUpload(e, index)"
                  />
                </label>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 space-y-2">
              <div class="flex items-center space-x-2">
                <input
                  v-model="page.number"
                  type="number"
                  min="1"
                  :disabled="autoNumbering"
                  class="w-20 bg-gray-600 text-white px-2 py-1 rounded"
                  placeholder="Số trang"
                />
                <input
                  v-model="page.title"
                  type="text"
                  class="flex-1 bg-gray-600 text-white px-2 py-1 rounded"
                  placeholder="Tiêu đề trang (tùy chọn)"
                />
              </div>
              <div class="text-sm text-gray-400">
                {{ formatFileSize(page.size) }} • {{ page.width }}x{{ page.height }}px
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2">
              <button
                type="button"
                @click="movePage(index, -1)"
                :disabled="index === 0"
                class="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Di chuyển lên"
              >
                <i class="fas fa-arrow-up"></i>
              </button>
              <button
                type="button"
                @click="movePage(index, 1)"
                :disabled="index === form.pages.length - 1"
                class="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Di chuyển xuống"
              >
                <i class="fas fa-arrow-down"></i>
              </button>
              <button
                type="button"
                @click="deletePage(index)"
                class="text-red-400 hover:text-red-300 transition-colors"
                title="Xóa"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="form.pages.length === 0"
            class="text-center py-12 text-gray-400"
          >
            <i class="fas fa-images text-4xl mb-2"></i>
            <div>Chưa có trang nào được tải lên</div>
            <div class="text-sm">Tải lên từng trang hoặc nhiều trang cùng lúc</div>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-end space-x-3">
        <router-link
          :to="`/admin/manga/${mangaId}/chapters`"
          class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Hủy
        </router-link>
        <button
          type="submit"
          :disabled="form.pages.length === 0"
          class="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Manga } from '@/types/manga'

interface Page {
  number: number
  title: string
  url: string
  size: number
  width: number
  height: number
}

const route = useRoute()
const router = useRouter()
const mangaId = route.params.mangaId as string
const chapterId = route.params.id as string
const isEditing = computed(() => chapterId !== 'new')

// Sample data
const manga = ref<Manga>({
  id: 'one-piece',
  title: 'One Piece',
  slug: 'one-piece',
  description: 'Theo chân cuộc phiêu lưu của Monkey D. Luffy...',
  coverImage: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
  status: 'ONGOING',
  categories: [
    { id: 'action', name: 'Action' },
    { id: 'adventure', name: 'Adventure' }
  ],
  totalChapters: 1089,
  views: 1523789,
  rating: 4.8,
  author: 'Eiichiro Oda',
  artist: 'Eiichiro Oda',
  releaseYear: '1997',
  createdAt: new Date(),
  updatedAt: new Date()
})

const form = ref({
  number: 0,
  title: '',
  pages: [] as Page[]
})

const autoNumbering = ref(true)

watch(autoNumbering, (value) => {
  if (value) {
    form.value.pages = form.value.pages.map((page, index) => ({
      ...page,
      number: index + 1
    }))
  }
})

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handlePageUpload = async (event: Event, index: number) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    await new Promise(resolve => img.onload = resolve)
    
    form.value.pages[index] = {
      ...form.value.pages[index],
      url,
      size: file.size,
      width: img.width,
      height: img.height
    }
  }
}

const handleBulkUpload = async (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || [])
  const startIndex = form.value.pages.length
  
  for (const [index, file] of files.entries()) {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    await new Promise(resolve => img.onload = resolve)
    
    form.value.pages.push({
      number: startIndex + index + 1,
      title: '',
      url,
      size: file.size,
      width: img.width,
      height: img.height
    })
  }
}

const movePage = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < form.value.pages.length) {
    const pages = [...form.value.pages]
    const temp = pages[index]
    pages[index] = pages[newIndex]
    pages[newIndex] = temp
    
    if (autoNumbering.value) {
      pages.forEach((page, i) => {
        page.number = i + 1
      })
    }
    
    form.value.pages = pages
  }
}

const deletePage = (index: number) => {
  form.value.pages.splice(index, 1)
  if (autoNumbering.value) {
    form.value.pages.forEach((page, i) => {
      page.number = i + 1
    })
  }
}

const handleSubmit = async () => {
  try {
    // TODO: Save chapter data to API
    console.log('Form data:', form.value)
    router.push(`/admin/manga/${mangaId}/chapters`)
  } catch (error) {
    console.error('Error saving chapter:', error)
  }
}

onMounted(async () => {
  if (isEditing.value) {
    // TODO: Fetch chapter data from API
    form.value = {
      number: 1089,
      title: 'The Weight of Memory',
      pages: Array(18).fill(null).map((_, i) => ({
        number: i + 1,
        title: '',
        url: 'https://example.com/page.jpg',
        size: 1024 * 1024, // 1MB
        width: 800,
        height: 1200
      }))
    }
  }
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

input[type="checkbox"] {
  accent-color: #FF6B6B;
}
</style> 