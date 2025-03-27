<template>
  <router-link 
    :to="`/manga/${manga.id}`"
    class="bg-background-light rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
  >
    <div class="relative">
      <img 
        :src="manga.coverImage" 
        :alt="manga.title" 
        class="w-full aspect-[2/3] object-cover"
      >
      <div class="absolute top-2 right-2 flex gap-1">
        <span 
          v-if="manga.status === 'ongoing'"
          class="px-2 py-1 text-xs bg-primary rounded-full"
        >
          Đang cập nhật
        </span>
        <span 
          v-else-if="manga.status === 'completed'"
          class="px-2 py-1 text-xs bg-green-600 rounded-full"
        >
          Hoàn thành
        </span>
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-bold mb-1 line-clamp-2">{{ manga.title }}</h3>
      <p class="text-sm text-gray-400 mb-2">Chapter {{ manga.latestChapter }}</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <i class="i-heroicons-star-20-solid text-yellow-500" />
          <span class="text-sm">{{ manga.rating.toFixed(1) }}</span>
        </div>
        <div class="flex items-center gap-1 text-sm text-gray-400">
          <i class="i-heroicons-eye-20-solid" />
          <span>{{ formatNumber(manga.views) }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
interface Manga {
  id: string
  title: string
  coverImage: string
  status: 'ongoing' | 'completed'
  latestChapter: number
  rating: number
  views: number
}

const props = defineProps<{
  manga: Manga
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