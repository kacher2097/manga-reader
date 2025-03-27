<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Manga Info -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Cover Image -->
        <div class="md:col-span-1">
          <div class="relative rounded-lg overflow-hidden">
            <img 
              :src="manga.cover"
              :alt="manga.title"
              class="w-full object-cover"
            />
            <div class="absolute top-2 left-2">
              <span 
                :class="[
                  'px-3 py-1 text-sm rounded-full',
                  manga.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'
                ]"
                class="text-white"
              >
                {{ manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành' }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-4 space-y-2">
            <button class="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center">
              <i class="fas fa-bookmark mr-2"></i>
              Theo dõi
            </button>
            <button class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center">
              <i class="fas fa-list mr-2"></i>
              Đọc từ đầu
            </button>
          </div>

          <!-- Stats -->
          <div class="mt-6 bg-gray-800 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <i class="fas fa-eye text-gray-400 mr-2"></i>
                <span>{{ formatNumber(manga.views) }} lượt xem</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-heart text-red-500 mr-2"></i>
                <span>{{ formatNumber(manga.favorites) }}</span>
              </div>
            </div>
            <div class="flex items-center">
              <i class="fas fa-star text-yellow-400 mr-2"></i>
              <span class="text-2xl font-bold">{{ manga.rating.toFixed(1) }}</span>
              <span class="text-gray-400 ml-2">({{ formatNumber(manga.ratings) }} đánh giá)</span>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="md:col-span-3">
          <h1 class="text-3xl font-bold mb-2">{{ manga.title }}</h1>
          <h2 class="text-xl text-gray-400 mb-6">{{ manga.alternativeTitle }}</h2>

          <div class="space-y-4">
            <!-- Authors & Artists -->
            <div>
              <h3 class="text-lg font-semibold mb-2">Tác giả</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="author in manga.authors" :key="author" class="px-3 py-1 bg-gray-800 rounded-full">
                  {{ author }}
                </span>
              </div>
            </div>

            <!-- Categories -->
            <div>
              <h3 class="text-lg font-semibold mb-2">Thể loại</h3>
              <div class="flex flex-wrap gap-2">
                <router-link 
                  v-for="category in manga.categories" 
                  :key="category.id"
                  :to="`/category/${category.id}`"
                  class="px-3 py-1 bg-gray-800 rounded-full hover:bg-red-500 transition-colors"
                >
                  {{ category.name }}
                </router-link>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h3 class="text-lg font-semibold mb-2">Giới thiệu</h3>
              <p class="text-gray-300 leading-relaxed">{{ manga.description }}</p>
            </div>
          </div>

          <!-- Chapter List -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">Danh sách chương</h3>
            <div class="bg-gray-800 rounded-lg divide-y divide-gray-700">
              <router-link
                v-for="chapter in manga.chapters"
                :key="chapter.id"
                :to="`/manga/${manga.id}/chapter/${chapter.id}`"
                class="flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
              >
                <div>
                  <span class="font-medium">Chapter {{ chapter.number }}</span>
                  <span class="text-gray-400 ml-2">{{ chapter.title }}</span>
                </div>
                <div class="text-sm text-gray-400">
                  {{ formatDate(chapter.updatedAt) }}
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const manga = ref({
  id: 'one-piece',
  title: 'One Piece',
  alternativeTitle: 'Vua Hải Tặc',
  cover: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
  status: 'ongoing' as const,
  views: 15000000,
  favorites: 500000,
  rating: 4.9,
  ratings: 100000,
  authors: ['Oda Eiichiro'],
  categories: [
    { id: 'action', name: 'Action' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'fantasy', name: 'Fantasy' }
  ],
  description: 'Monkey D. Luffy từ chối tuân theo lối đi mà cha mình đã chọn cho mình. Thay vì gia nhập Hải quân và trở thành một người lính, tuổi thơ của cậu bé đã được truyền cảm hứng bởi một cướp biển say rượu và đầy quyền lực tên Shanks "Tóc Đỏ". Luffy theo gót chân của người anh hùng thời thơ ấu của mình và bắt đầu cuộc hành trình vĩ đại để trở thành Vua Hải Tặc - người sở hữu kho báu vĩ đại nhất thế giới One Piece và từ đó trở thành Vua Hải Tặc.',
  chapters: [
    { id: '1089', number: 1089, title: 'Những kẻ mạnh nhất', updatedAt: '2024-02-15T10:00:00Z' },
    { id: '1088', number: 1088, title: 'Luffy vs Kaido', updatedAt: '2024-02-08T10:00:00Z' },
    { id: '1087', number: 1087, title: 'Gear 5', updatedAt: '2024-02-01T10:00:00Z' },
    // Add more chapters
  ]
})

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
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  // In a real app, fetch manga data using route.params.id
  console.log('Manga ID:', route.params.id)
})
</script> 