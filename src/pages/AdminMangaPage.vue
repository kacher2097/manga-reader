<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Quản lý Manga</h1>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>
          Thêm Manga Mới
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="mb-6 flex gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm manga..."
            class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ongoing">Đang tiến hành</option>
          <option value="completed">Đã hoàn thành</option>
          <option value="dropped">Đã drop</option>
        </select>
      </div>

      <!-- Manga List -->
      <div class="bg-gray-800 rounded-lg overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-700">
              <th class="px-6 py-3 text-left">Manga</th>
              <th class="px-6 py-3 text-left">Tác giả</th>
              <th class="px-6 py-3 text-left">Trạng thái</th>
              <th class="px-6 py-3 text-left">Chapter mới nhất</th>
              <th class="px-6 py-3 text-left">Lượt xem</th>
              <th class="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="manga in filteredMangas" :key="manga.id" class="hover:bg-gray-700/50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img
                    :src="manga.coverImage"
                    :alt="manga.title"
                    class="w-12 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <div class="font-medium">{{ manga.title }}</div>
                    <div class="text-sm text-gray-400">ID: {{ manga.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">{{ manga.author }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2 py-1 rounded text-sm',
                    manga.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                    manga.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  ]"
                >
                  {{ formatStatus(manga.status) }}
                </span>
              </td>
              <td class="px-6 py-4">Chapter {{ manga.latestChapter }}</td>
              <td class="px-6 py-4">{{ formatNumber(manga.views) }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="openEditModal(manga)"
                    class="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="openChapterModal(manga)"
                    class="p-2 text-green-400 hover:text-green-300 transition-colors"
                    title="Quản lý chapter"
                  >
                    <i class="fas fa-list-ol"></i>
                  </button>
                  <button
                    @click="confirmDelete(manga)"
                    class="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Manga Modal -->
    <div
      v-if="showMangaModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showMangaModal = false"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 class="text-2xl font-bold mb-6">
          {{ editingManga ? 'Chỉnh sửa Manga' : 'Thêm Manga Mới' }}
        </h2>
        
        <form @submit.prevent="saveManga" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Tiêu đề</label>
              <input
                v-model="mangaForm.title"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">ID (slug)</label>
              <input
                v-model="mangaForm.id"
                type="text"
                required
                :disabled="!!editingManga"
                class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              v-model="mangaForm.description"
              rows="3"
              class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Ảnh bìa (URL)</label>
              <input
                v-model="mangaForm.coverImage"
                type="url"
                required
                class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Trạng thái</label>
              <select
                v-model="mangaForm.status"
                class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ongoing">Đang tiến hành</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="dropped">Đã drop</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Tác giả</label>
              <input
                v-model="mangaForm.author"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Họa sĩ</label>
              <input
                v-model="mangaForm.artist"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Năm phát hành</label>
              <input
                v-model="mangaForm.releaseYear"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Thể loại</label>
              <input
                v-model="categoriesInput"
                type="text"
                placeholder="Nhập thể loại, phân cách bằng dấu phẩy"
                class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              @click="showMangaModal = false"
              class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              {{ editingManga ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Chapter Management Modal -->
    <div
      v-if="showChapterModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showChapterModal = false"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Quản lý Chapter - {{ selectedManga?.title }}</h2>
          <button
            @click="openAddChapterModal"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center"
          >
            <i class="fas fa-plus mr-2"></i>
            Thêm Chapter
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="chapter in mangaChapters" :key="chapter.id" class="bg-gray-700 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-medium">Chapter {{ chapter.number }}</h3>
                <p class="text-sm text-gray-400">{{ chapter.title }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="editChapter(chapter)"
                  class="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteChapter(chapter)"
                  class="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Chapter Modal -->
    <div
      v-if="showChapterFormModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showChapterFormModal = false"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 class="text-2xl font-bold mb-6">
          {{ editingChapter ? 'Chỉnh sửa Chapter' : 'Thêm Chapter Mới' }}
        </h2>
        
        <form @submit.prevent="saveChapter" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Số chapter</label>
              <input
                v-model.number="chapterForm.number"
                type="number"
                required
                class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tiêu đề</label>
              <input
                v-model="chapterForm.title"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Danh sách trang (URL)</label>
            <div class="space-y-2">
              <div
                v-for="(page, index) in chapterForm.pages"
                :key="index"
                class="flex gap-2"
              >
                <input
                  v-model="chapterForm.pages[index]"
                  type="url"
                  required
                  placeholder="URL trang truyện"
                  class="flex-1 px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  @click="removePage(index)"
                  class="px-3 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addPage"
              class="mt-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <i class="fas fa-plus mr-2"></i>
              Thêm trang
            </button>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              @click="showChapterFormModal = false"
              class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              {{ editingChapter ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import type { Manga, Chapter } from '@/services/api'

// State
const mangas = ref<Manga[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const showMangaModal = ref(false)
const showChapterModal = ref(false)
const showChapterFormModal = ref(false)
const editingManga = ref<Manga | null>(null)
const selectedManga = ref<Manga | null>(null)
const mangaChapters = ref<Chapter[]>([])
const editingChapter = ref<Chapter | null>(null)

// Form state
const mangaForm = ref({
  id: '',
  title: '',
  description: '',
  coverImage: '',
  status: 'ongoing' as 'ongoing' | 'completed' | 'dropped',
  categories: [] as string[],
  author: '',
  artist: '',
  releaseYear: '',
  latestChapter: 0,
  views: 0,
  rating: 0
})

const chapterForm = ref({
  number: 0,
  title: '',
  pages: ['']
})

const categoriesInput = ref('')

// Computed
const filteredMangas = computed(() => {
  let result = [...mangas.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(manga => 
      manga.title.toLowerCase().includes(query) ||
      manga.author.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    result = result.filter(manga => manga.status === statusFilter.value)
  }
  
  return result
})

// Methods
const formatStatus = (status: string) => {
  switch (status) {
    case 'ongoing': return 'Đang tiến hành'
    case 'completed': return 'Đã hoàn thành'
    case 'dropped': return 'Đã drop'
    default: return status
  }
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

const openAddModal = () => {
  editingManga.value = null
  mangaForm.value = {
    id: '',
    title: '',
    description: '',
    coverImage: '',
    status: 'ongoing',
    categories: [],
    author: '',
    artist: '',
    releaseYear: '',
    latestChapter: 0,
    views: 0,
    rating: 0
  }
  categoriesInput.value = ''
  showMangaModal.value = true
}

const openEditModal = (manga: Manga) => {
  editingManga.value = manga
  mangaForm.value = { ...manga }
  categoriesInput.value = manga.categories.join(', ')
  showMangaModal.value = true
}

const saveManga = async () => {
  try {
    mangaForm.value.categories = categoriesInput.value
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat)

    if (editingManga.value) {
      await api.updateManga(mangaForm.value)
    } else {
      await api.createManga(mangaForm.value)
    }

    await loadMangas()
    showMangaModal.value = false
  } catch (error) {
    console.error('Error saving manga:', error)
    alert('Có lỗi xảy ra khi lưu manga')
  }
}

const confirmDelete = async (manga: Manga) => {
  if (confirm(`Bạn có chắc chắn muốn xóa manga "${manga.title}"?`)) {
    try {
      await api.deleteManga(manga.id)
      await loadMangas()
    } catch (error) {
      console.error('Error deleting manga:', error)
      alert('Có lỗi xảy ra khi xóa manga')
    }
  }
}

const openChapterModal = async (manga: Manga) => {
  selectedManga.value = manga
  try {
    mangaChapters.value = await api.getChaptersByMangaId(manga.id)
    showChapterModal.value = true
  } catch (error) {
    console.error('Error loading chapters:', error)
    alert('Có lỗi xảy ra khi tải danh sách chapter')
  }
}

const openAddChapterModal = () => {
  editingChapter.value = null
  chapterForm.value = {
    number: selectedManga.value?.latestChapter ? selectedManga.value.latestChapter + 1 : 1,
    title: '',
    pages: ['']
  }
  showChapterFormModal.value = true
}

const editChapter = (chapter: Chapter) => {
  editingChapter.value = chapter
  chapterForm.value = { ...chapter }
  showChapterFormModal.value = true
}

const addPage = () => {
  chapterForm.value.pages.push('')
}

const removePage = (index: number) => {
  chapterForm.value.pages.splice(index, 1)
}

const saveChapter = async () => {
  if (!selectedManga.value) return

  try {
    const chapterData = {
      ...chapterForm.value,
      mangaId: selectedManga.value.id
    }

    if (editingChapter.value) {
      await api.updateChapter(selectedManga.value.id, editingChapter.value.number, chapterData)
    } else {
      await api.createChapter(selectedManga.value.id, chapterData)
    }

    await loadMangas()
    mangaChapters.value = await api.getChaptersByMangaId(selectedManga.value.id)
    showChapterFormModal.value = false
  } catch (error) {
    console.error('Error saving chapter:', error)
    alert('Có lỗi xảy ra khi lưu chapter')
  }
}

const deleteChapter = async (chapter: Chapter) => {
  if (!selectedManga.value) return

  if (confirm(`Bạn có chắc chắn muốn xóa chapter ${chapter.number}?`)) {
    try {
      await api.deleteChapter(selectedManga.value.id, chapter.number)
      mangaChapters.value = await api.getChaptersByMangaId(selectedManga.value.id)
    } catch (error) {
      console.error('Error deleting chapter:', error)
      alert('Có lỗi xảy ra khi xóa chapter')
    }
  }
}

const loadMangas = async () => {
  try {
    mangas.value = await api.getAllMangas()
  } catch (error) {
    console.error('Error loading mangas:', error)
    alert('Có lỗi xảy ra khi tải danh sách manga')
  }
}

// Initial load
onMounted(loadMangas)
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

.ring-primary {
  --tw-ring-color: #FF6B6B;
}
</style> 