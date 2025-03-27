<template>
  <div class="pt-header">
    <div class="max-w-container mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">Manga phổ biến</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-400">Thời gian:</span>
          <select 
            v-model="timeRange"
            class="bg-background-light rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="day">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
            <option value="all">Tất cả</option>
          </select>
        </div>
      </div>

      <!-- Top Rankings -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div 
          v-for="(type, index) in rankingTypes"
          :key="type.value"
          class="bg-background-light rounded-lg p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">{{ type.label }}</h2>
            <router-link 
              :to="`/rankings/${type.value}`"
              class="text-primary hover:underline"
            >
              Xem tất cả
            </router-link>
          </div>
          <div class="space-y-4">
            <div 
              v-for="(manga, mIndex) in getTopManga(type.value)"
              :key="manga.id"
              class="flex gap-4"
            >
              <div class="relative shrink-0">
                <span 
                  class="absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold"
                  :class="[
                    mIndex === 0 ? 'bg-yellow-500' :
                    mIndex === 1 ? 'bg-gray-400' :
                    mIndex === 2 ? 'bg-amber-700' :
                    'bg-background'
                  ]"
                >
                  {{ mIndex + 1 }}
                </span>
                <img 
                  :src="manga.coverImage"
                  :alt="manga.title"
                  class="w-16 aspect-[2/3] object-cover rounded"
                >
              </div>
              <div class="flex-1 min-w-0">
                <router-link 
                  :to="`/manga/${manga.id}`"
                  class="font-bold hover:text-primary line-clamp-2"
                >
                  {{ manga.title }}
                </router-link>
                <div class="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <span>{{ type.value === 'rating' ? `${manga.rating}★` : formatNumber(manga[type.value]) }}</span>
                  <span>Chapter {{ manga.latestChapter }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Popular Manga -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <manga-card
          v-for="manga in popularManga"
          :key="manga.id"
          :manga="manga"
        />
      </div>

      <!-- Load More -->
      <div class="flex justify-center mt-12">
        <button 
          class="btn btn-primary"
          @click="loadMore"
          :disabled="loading"
        >
          <span v-if="loading">Đang tải...</span>
          <span v-else>Xem thêm</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MangaCard from '../components/ui/MangaCard.vue'

// Mock data
const rankingTypes: Array<{ value: 'views' | 'rating' | 'favorites', label: string }> = [
  { value: 'views', label: 'Lượt xem' },
  { value: 'rating', label: 'Đánh giá' },
  { value: 'favorites', label: 'Yêu thích' },
]

interface Manga {
  id: string;
  title: string;
  coverImage: string;
  status: 'ongoing' | 'completed';
  latestChapter: number;
  rating: number;
  views: number;
  favorites: number;
}

const manga: Manga[] = [
  {
    id: '1',
    title: 'One Piece',
    coverImage: '/manga/one-piece.jpg',
    status: 'ongoing',
    latestChapter: 1089,
    rating: 4.9,
    views: 1500000,
    favorites: 50000,
  },
  {
    id: '2',
    title: 'Naruto',
    coverImage: '/manga/naruto.jpg',
    status: 'completed',
    latestChapter: 700,
    rating: 4.8,
    views: 1200000,
    favorites: 45000,
  },
  // Add more manga...
]

// State
const timeRange = ref('week')
const loading = ref(false)
const popularManga = ref(manga)

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

const getTopManga = (type: keyof Pick<Manga, 'rating' | 'views' | 'favorites'>) => {
  return [...manga]
    .sort((a, b) => b[type] - a[type])
    .slice(0, 5)
}

const loadMore = async () => {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Add more manga to the list
  loading.value = false
}
</script> 