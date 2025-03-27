<template>
  <div class="pt-header">
    <div class="max-w-container mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-8">Thể loại manga</h1>
      
      <!-- Categories Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.id}`"
          class="group relative aspect-video rounded-lg overflow-hidden"
        >
          <img 
            :src="category.image" 
            :alt="category.name"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
            <div>
              <h3 class="text-xl font-bold mb-1">{{ category.name }}</h3>
              <p class="text-sm text-gray-300">{{ formatNumber(category.mangaCount) }} manga</p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Popular Tags -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6">Tags phổ biến</h2>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="tag in popularTags"
            :key="tag.id"
            class="px-4 py-2 rounded-full bg-background-light hover:bg-background transition-colors"
            @click="selectTag(tag)"
          >
            {{ tag.name }}
            <span class="text-sm text-gray-400 ml-2">({{ formatNumber(tag.count) }})</span>
          </button>
        </div>
      </div>

      <!-- Filtered Manga List -->
      <div v-if="selectedTag" class="mt-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">Manga với tag "{{ selectedTag.name }}"</h2>
          <button 
            class="text-gray-400 hover:text-primary"
            @click="selectedTag = null"
          >
            Xóa bộ lọc
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <manga-card
            v-for="manga in filteredManga"
            :key="manga.id"
            :manga="manga"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MangaCard from '../components/ui/MangaCard.vue'

interface Category {
  id: number
  name: string
  image: string
  mangaCount: number
}

interface Tag {
  id: number
  name: string
  count: number
}

// Mock data
const categories: Category[] = [
  {
    id: 1,
    name: 'Action',
    image: '/categories/action.jpg',
    mangaCount: 1500,
  },
  {
    id: 2,
    name: 'Romance',
    image: '/categories/romance.jpg',
    mangaCount: 1200,
  },
  {
    id: 3,
    name: 'Comedy',
    image: '/categories/comedy.jpg',
    mangaCount: 1000,
  },
  // Add more categories...
]

const popularTags: Tag[] = [
  { id: 1, name: 'School Life', count: 500 },
  { id: 2, name: 'Fantasy', count: 800 },
  { id: 3, name: 'Magic', count: 300 },
  { id: 4, name: 'Martial Arts', count: 400 },
  { id: 5, name: 'Supernatural', count: 600 },
  // Add more tags...
]

const filteredManga = [
  {
    id: '1',
    title: 'One Piece',
    coverImage: '/manga/one-piece.jpg',
    status: 'ongoing',
    latestChapter: 1089,
    rating: 4.9,
    views: 1500000,
  },
  // Add more manga...
]

// State
const selectedTag = ref<Tag | null>(null)

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

const selectTag = (tag: Tag) => {
  selectedTag.value = tag
}
</script> 