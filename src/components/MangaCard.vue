<template>
  <router-link :to="`/manga/${manga.id}`" class="block group">
    <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div class="relative pb-[140%] overflow-hidden">
        <img 
          :src="manga.coverImage"
          :alt="manga.title"
          class="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div class="absolute top-0 left-0 m-2">
          <span 
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full text-white',
              manga.status === 'ongoing' ? 'bg-green-500/90' : 'bg-blue-500/90'
            ]"
          >
            {{ manga.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành' }}
          </span>
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
          <div class="text-white text-sm font-medium">Chapter {{ manga.latestChapter }}</div>
        </div>
      </div>
      <div class="p-3 bg-gray-800">
        <h3 class="text-base font-semibold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {{ manga.title }}
        </h3>
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center text-gray-300">
            <i class="fas fa-eye mr-1"></i>
            <span>{{ formatNumber(manga.views) }}</span>
          </div>
          <div class="flex items-center text-yellow-400">
            <i class="fas fa-star mr-1"></i>
            <span class="font-medium">{{ manga.rating.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Manga } from '@/services/api';

const props = defineProps<{
  manga: Manga
}>();

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// WebSocket connection for real-time updates
const ws = ref<WebSocket | null>(null);

onMounted(() => {
  try {
    ws.value = new WebSocket('ws://localhost:7000/ws');
    
    ws.value.onopen = () => {
      if (ws.value) {
        ws.value.send(JSON.stringify({
          type: 'subscribe_chapters',
          mangaId: props.manga.id
        }));
      }
    };
    
    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received update:', data);
    };
    
    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  } catch (error) {
    console.error('Failed to connect to WebSocket:', error);
  }
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 