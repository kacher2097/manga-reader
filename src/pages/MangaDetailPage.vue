<template>
  <div class="pt-header">
    <!-- Hero Section -->
    <div 
      class="h-[500px] bg-cover bg-center relative"
      :style="{ backgroundImage: `url(${manga.coverImage})` }"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0">
        <div class="max-w-container mx-auto px-4 py-8 flex gap-8">
          <img 
            :src="manga.coverImage" 
            :alt="manga.title"
            class="w-64 aspect-[2/3] object-cover rounded-lg shadow-xl"
          >
          <div class="flex-1">
            <h1 class="text-4xl font-bold mb-4">{{ manga.title }}</h1>
            <div class="flex items-center gap-6 mb-6">
              <div class="flex items-center gap-2">
                <i class="i-heroicons-star-20-solid text-yellow-500" />
                <span class="text-lg">{{ manga.rating.toFixed(1) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="i-heroicons-eye-20-solid text-gray-400" />
                <span>{{ formatNumber(manga.views) }} lượt xem</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="i-heroicons-bookmark-20-solid text-gray-400" />
                <span>{{ formatNumber(manga.favorites) }} lượt thích</span>
              </div>
            </div>
            <div class="flex gap-4 mb-6">
              <button 
                class="btn btn-primary flex items-center gap-2"
                @click="startReading"
              >
                <i class="i-heroicons-book-open-20-solid" />
                Đọc ngay
              </button>
              <button 
                class="btn bg-background-light hover:bg-background flex items-center gap-2"
                @click="toggleFavorite"
              >
                <i :class="[
                  isFavorited ? 'text-red-500' : 'text-gray-400',
                  'i-heroicons-heart-20-solid'
                ]" />
                {{ isFavorited ? 'Đã thích' : 'Thích' }}
              </button>
            </div>
            <p class="text-gray-300 mb-4">{{ manga.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in manga.tags" 
                :key="tag"
                class="px-3 py-1 bg-background-light rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chapter List -->
    <div class="max-w-container mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Danh sách chapter</h2>
        <div class="flex items-center gap-4">
          <span class="text-gray-400">Sắp xếp:</span>
          <button 
            class="btn bg-background-light hover:bg-background"
            @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
          >
            {{ sortOrder === 'asc' ? 'Cũ nhất' : 'Mới nhất' }}
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <router-link
          v-for="chapter in sortedChapters"
          :key="chapter.number"
          :to="`/manga/${manga.id}/chapter/${chapter.number}`"
          class="p-4 bg-background-light rounded-lg hover:bg-background transition-colors"
        >
          <div class="flex items-center justify-between">
            <span>Chapter {{ chapter.number }}</span>
            <span class="text-sm text-gray-400">{{ formatDate(chapter.releaseDate) }}</span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Comments Section -->
    <div class="max-w-container mx-auto px-4 pb-12">
      <h2 class="text-2xl font-bold mb-6">Bình luận</h2>
      <div class="space-y-6">
        <!-- Comment Form -->
        <div v-if="isLoggedIn" class="bg-background-light rounded-lg p-4">
          <textarea
            v-model="commentText"
            rows="3"
            placeholder="Viết bình luận của bạn..."
            class="w-full bg-background rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
          <div class="flex justify-end mt-4">
            <button 
              class="btn btn-primary"
              @click="submitComment"
              :disabled="!commentText.trim()"
            >
              Gửi bình luận
            </button>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-400 mb-4">Đăng nhập để bình luận</p>
          <router-link to="/login" class="btn btn-primary">
            Đăng nhập
          </router-link>
        </div>

        <!-- Comments List -->
        <div class="space-y-4">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="bg-background-light rounded-lg p-4"
          >
            <div class="flex items-center gap-4 mb-4">
              <img 
                :src="comment.user.avatar" 
                :alt="comment.user.name"
                class="w-10 h-10 rounded-full"
              >
              <div>
                <h4 class="font-bold">{{ comment.user.name }}</h4>
                <span class="text-sm text-gray-400">{{ formatDate(comment.date) }}</span>
              </div>
            </div>
            <p>{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Mock data
const manga = {
  id: route.params.id,
  title: 'One Piece',
  description: 'Theo chân cuộc phiêu lưu của Monkey D. Luffy và băng hải tặc Mũ Rơm trong hành trình trở thành Vua Hải Tặc',
  coverImage: '/manga/one-piece-banner.jpg',
  rating: 4.9,
  views: 1500000,
  favorites: 50000,
  tags: ['Action', 'Adventure', 'Comedy', 'Fantasy', 'Shounen'],
}

const chapters = [
  { number: 1, releaseDate: '2023-01-01' },
  { number: 2, releaseDate: '2023-01-08' },
  // Add more chapters...
]

const comments = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      avatar: '/default-avatar.jpg',
    },
    content: 'Truyện hay quá!',
    date: '2023-01-01',
  },
  // Add more comments...
]

// State
const sortOrder = ref<'asc' | 'desc'>('desc')
const commentText = ref('')
const isLoggedIn = ref(false)
const isFavorited = ref(false)

// Computed
const sortedChapters = computed(() => {
  return [...chapters].sort((a, b) => {
    if (sortOrder.value === 'asc') {
      return a.number - b.number
    }
    return b.number - a.number
  })
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

const startReading = () => {
  router.push(`/manga/${manga.id}/chapter/1`)
}

const toggleFavorite = () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  isFavorited.value = !isFavorited.value
}

const submitComment = () => {
  // Add comment logic here
  commentText.value = ''
}
</script> 