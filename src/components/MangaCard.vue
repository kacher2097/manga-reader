<template>
  <router-link :to="`/manga/${manga.id}`" class="block group">
    <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div class="relative pb-[140%]">
        <img 
          :src="manga.cover"
          :alt="manga.title"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="absolute top-0 left-0 m-2">
          <span 
            :class="[
              'px-2 py-1 text-xs rounded-full',
              manga.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'
            ]"
            class="text-white"
          >
            {{ manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành' }}
          </span>
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <div class="text-white text-sm">Chapter {{ manga.latestChapter }}</div>
        </div>
      </div>
      <div class="p-2">
        <h3 class="text-sm font-medium line-clamp-1 dark:text-gray-100">{{ manga.title }}</h3>
        <div class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <i class="fas fa-eye mr-1"></i>
          <span>{{ formatNumber(manga.views) }}</span>
          <i class="fas fa-star ml-3 mr-1 text-yellow-400"></i>
          <span>{{ manga.rating.toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
interface MangaProps {
  id: string
  title: string
  cover: string
  status: 'ongoing' | 'completed'
  latestChapter: number
  views: number
  rating: number
}

defineProps<{
  manga: MangaProps
}>()

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 