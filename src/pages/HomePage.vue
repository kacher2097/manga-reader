<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Hero Section with Trending Manga -->
    <section class="bg-gradient-to-b from-gray-800 to-gray-900 py-6">
      <div class="container mx-auto px-4">
        <swiper
          :modules="[Autoplay, Pagination, Navigation]"
          :slides-per-view="1"
          :loop="true"
          :autoplay="{ delay: 5000 }"
          :pagination="{ clickable: true }"
          :navigation="true"
          class="h-[350px] rounded-xl overflow-hidden"
        >
          <swiper-slide v-for="manga in trendingManga" :key="manga.id">
            <div class="relative h-full">
              <img 
                :src="manga.coverImage"
                :alt="manga.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <div class="absolute bottom-0 left-0 p-6">
                  <h1 class="text-3xl font-bold mb-2">{{ manga.title }}</h1>
                  <p class="text-base text-gray-200 mb-4 max-w-2xl line-clamp-2">
                    {{ manga.description }}
                  </p>
                  <router-link 
                    :to="`/manga/${manga.id}`"
                    class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors inline-flex items-center text-sm"
                  >
                    <span>Đọc ngay</span>
                    <i class="fas fa-arrow-right ml-2"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </section>

    <div class="container mx-auto px-4 py-6 space-y-8">
      <!-- Latest Updates -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold flex items-center">
            <i class="fas fa-clock text-red-500 mr-2"></i>
            Mới cập nhật
          </h2>
          <router-link 
            to="/latest" 
            class="text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            Xem tất cả
            <i class="fas fa-arrow-right ml-1"></i>
          </router-link>
        </div>
        <div v-if="loading.latest" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
        <div v-else-if="error.latest" class="text-red-500 text-center py-8">
          {{ error.latest }}
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <MangaCard 
            v-for="manga in latestMangas" 
            :key="manga.id" 
            :manga="manga"
            class="hover:scale-105 transition-transform duration-200"
          />
        </div>
      </section>

      <!-- Popular Manga -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold flex items-center">
            <i class="fas fa-fire text-red-500 mr-2"></i>
            Phổ biến
          </h2>
          <router-link 
            to="/popular" 
            class="text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            Xem tất cả
            <i class="fas fa-arrow-right ml-1"></i>
          </router-link>
        </div>
        <div v-if="loading.popular" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
        <div v-else-if="error.popular" class="text-red-500 text-center py-8">
          {{ error.popular }}
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <MangaCard 
            v-for="manga in popularMangas" 
            :key="manga.id" 
            :manga="manga"
            class="hover:scale-105 transition-transform duration-200"
          />
        </div>
      </section>

      <!-- Top Rated -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold flex items-center">
            <i class="fas fa-star text-red-500 mr-2"></i>
            Đánh giá cao
          </h2>
          <router-link 
            to="/top-rated" 
            class="text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            Xem tất cả
            <i class="fas fa-arrow-right ml-1"></i>
          </router-link>
        </div>
        <div v-if="loading.topRated" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
        <div v-else-if="error.topRated" class="text-red-500 text-center py-8">
          {{ error.topRated }}
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <MangaCard 
            v-for="manga in topRatedMangas" 
            :key="manga.id" 
            :manga="manga"
            class="hover:scale-105 transition-transform duration-200"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import MangaCard from '../components/MangaCard.vue'
import api from '@/services/api'
import type { Manga } from '@/types/manga'

// States
const trendingManga = ref<Manga[]>([])
const latestMangas = ref<Manga[]>([])
const popularMangas = ref<Manga[]>([])
const topRatedMangas = ref<Manga[]>([])

const loading = ref({
  trending: true,
  latest: true,
  popular: true,
  topRated: true
})

const error = ref({
  trending: '',
  latest: '',
  popular: '',
  topRated: ''
})

onMounted(async () => {
  // Fetch trending manga
  try {
    trendingManga.value = await api.getTrendingManga()
  } catch (err) {
    error.value.trending = 'Không thể tải danh sách truyện trending'
  } finally {
    loading.value.trending = false
  }

  // Fetch latest manga
  try {
    latestMangas.value = await api.getLatestMangas()
  } catch (err) {
    error.value.latest = 'Không thể tải danh sách truyện mới'
  } finally {
    loading.value.latest = false
  }

  // Fetch popular manga
  try {
    popularMangas.value = await api.getPopularMangas()
  } catch (err) {
    error.value.popular = 'Không thể tải danh sách truyện phổ biến'
  } finally {
    loading.value.popular = false
  }

  // Fetch top rated manga
  try {
    topRatedMangas.value = await api.getTopRatedMangas()
  } catch (err) {
    error.value.topRated = 'Không thể tải danh sách truyện đánh giá cao'
  } finally {
    loading.value.topRated = false
  }
})
</script>

<style scoped>
:deep(.swiper-pagination-bullet) {
  background: white;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 