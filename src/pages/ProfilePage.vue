<template>
  <div class="pt-header">
    <div class="max-w-container mx-auto px-4 py-12">
      <!-- Profile Header -->
      <div class="flex items-center gap-8 mb-12">
        <div class="relative group">
          <img 
            :src="user.avatar || '/default-avatar.jpg'" 
            :alt="user.username"
            class="w-32 h-32 rounded-full object-cover"
          >
          <button 
            class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            @click="uploadAvatar"
          >
            <i class="i-heroicons-camera-20-solid" />
          </button>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-4 mb-4">
            <h1 class="text-3xl font-bold">{{ user.username }}</h1>
            <button 
              class="btn bg-background-light hover:bg-background"
              @click="showEditProfile = true"
            >
              <i class="i-heroicons-pencil-20-solid" />
              <span class="ml-2">Chỉnh sửa</span>
            </button>
          </div>
          <div class="flex items-center gap-6 text-gray-400">
            <div class="flex items-center gap-2">
              <i class="i-heroicons-calendar-20-solid" />
              <span>Tham gia {{ formatDate(user.joinDate) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="i-heroicons-bookmark-20-solid" />
              <span>{{ formatNumber(user.favorites) }} truyện yêu thích</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="i-heroicons-chat-bubble-left-20-solid" />
              <span>{{ formatNumber(user.comments) }} bình luận</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Reading History -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">Lịch sử đọc truyện</h2>
          <button 
            class="text-gray-400 hover:text-primary"
            @click="clearHistory"
          >
            Xóa lịch sử
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <manga-card
            v-for="manga in readingHistory"
            :key="manga.id"
            :manga="manga"
          >
            <template #footer>
              <div class="text-sm text-gray-400">
                Đã đọc: Chapter {{ manga.lastReadChapter }}
              </div>
            </template>
          </manga-card>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <dialog
        :open="showEditProfile"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @close="showEditProfile = false"
      >
        <div class="bg-background-light rounded-lg p-6 w-full max-w-md">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold">Chỉnh sửa hồ sơ</h3>
            <button
              class="text-gray-400 hover:text-white"
              @click="showEditProfile = false"
            >
              <i class="i-heroicons-x-mark-20-solid" />
            </button>
          </div>
          <form @submit.prevent="updateProfile">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">
                  Tên người dùng
                </label>
                <input
                  v-model="editForm.username"
                  type="text"
                  required
                  class="input"
                >
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  v-model="editForm.email"
                  type="email"
                  required
                  class="input"
                >
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">
                  Mật khẩu mới
                </label>
                <input
                  v-model="editForm.newPassword"
                  type="password"
                  class="input"
                  placeholder="Để trống nếu không đổi"
                >
              </div>
            </div>
            <div class="flex justify-end gap-4 mt-6">
              <button
                type="button"
                class="btn bg-background hover:bg-background-light"
                @click="showEditProfile = false"
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
                  <span class="ml-2">Đang lưu...</span>
                </template>
                <span v-else>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MangaCard from '../components/ui/MangaCard.vue'

// Mock data
const user = {
  username: 'JohnDoe',
  email: 'john@example.com',
  avatar: null,
  joinDate: '2023-01-01',
  favorites: 42,
  comments: 156,
}

const readingHistory = [
  {
    id: '1',
    title: 'One Piece',
    coverImage: '/manga/one-piece.jpg',
    status: 'ongoing' as const,
    latestChapter: 1089,
    lastReadChapter: 1088,
    rating: 4.9,
    views: 1500000,
  },
  // Add more manga...
]

// State
const showEditProfile = ref(false)
const loading = ref(false)
const editForm = ref({
  username: user.username,
  email: user.email,
  newPassword: '',
})

// Methods
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const uploadAvatar = () => {
  // Implement avatar upload logic
}

const updateProfile = async () => {
  try {
    loading.value = true
    // Implement profile update logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    showEditProfile.value = false
  } finally {
    loading.value = false
  }
}

const clearHistory = async () => {
  if (!confirm('Bạn có chắc muốn xóa lịch sử đọc truyện?')) return
  // Implement clear history logic
}
</script> 