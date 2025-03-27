<template>
  <div>
    <!-- Hero Section -->
    <section class="h-hero mt-header relative">
      <swiper
        :modules="[SwiperAutoplay, SwiperPagination, SwiperNavigation]"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 5000 }"
        :pagination="{ clickable: true }"
        :navigation="true"
      >
        <swiper-slide v-for="manga in featuredManga" :key="manga.id">
          <div 
            class="h-hero bg-cover bg-center relative"
            :style="{ backgroundImage: `url(${manga.coverImage})` }"
          >
            <div class="absolute inset-0 bg-black/50"></div>
            <div class="relative max-w-container mx-auto px-4 h-full flex flex-col justify-center">
              <h1 class="text-4xl font-bold mb-4">{{ manga.title }}</h1>
              <p class="text-gray-300 max-w-xl mb-6">
                {{ manga.description }}
              </p>
              <router-link 
                :to="`/manga/${manga.id}`"
                class="px-6 py-3 bg-primary rounded-lg hover:bg-primary-dark transition-colors w-fit"
              >
                Đọc ngay
              </router-link>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </section>

    <!-- Main Content -->
    <main class="max-w-container mx-auto px-4 py-12">
      <div class="flex gap-8">
        <!-- Sidebar -->
        <aside class="w-[300px] shrink-0 space-y-6">
          <!-- Categories -->
          <div class="bg-background-light rounded-lg p-4">
            <h2 class="text-xl font-bold mb-4">Thể loại</h2>
            <div class="space-y-2">
              <label 
                v-for="category in categories" 
                :key="category.id"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input 
                  type="checkbox"
                  v-model="selectedCategories"
                  :value="category.id"
                  class="accent-primary"
                >
                <span>{{ category.name }}</span>
              </label>
            </div>
          </div>

          <!-- Filters -->
          <div class="bg-background-light rounded-lg p-4">
            <h2 class="text-xl font-bold mb-4">Bộ lọc</h2>
            <div class="space-y-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  v-model="filters.completed"
                  class="accent-primary"
                >
                <span>Đã hoàn thành</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  v-model="filters.ongoing"
                  class="accent-primary"
                >
                <span>Đang cập nhật</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Manga Grid -->
        <div class="flex-1">
          <!-- Section: Mới cập nhật -->
          <section class="mb-12">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold">Mới cập nhật</h2>
              <router-link 
                to="/latest"
                class="text-primary hover:underline"
              >
                Xem tất cả
              </router-link>
            </div>
            <div class="grid grid-cols-4 gap-6">
              <manga-card
                v-for="manga in latestManga"
                :key="manga.id"
                :manga="manga"
              />
            </div>
          </section>

          <!-- Section: Phổ biến -->
          <section class="mb-12">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold">Phổ biến</h2>
              <router-link 
                to="/popular"
                class="text-primary hover:underline"
              >
                Xem tất cả
              </router-link>
            </div>
            <div class="grid grid-cols-4 gap-6">
              <manga-card
                v-for="manga in popularManga"
                :key="manga.id"
                :manga="manga"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import MangaCard from '../components/ui/MangaCard.vue'

// Mock data
const categories = [
  { id: 1, name: 'Shonen' },
  { id: 2, name: 'Shojo' },
  { id: 3, name: 'Seinen' },
  { id: 4, name: 'Action' },
  { id: 5, name: 'Adventure' },
  { id: 6, name: 'Comedy' },
  { id: 7, name: 'Drama' },
  { id: 8, name: 'Fantasy' },
]

const featuredManga = [
  {
    id: '1',
    title: 'One Piece',
    description: 'Theo chân cuộc phiêu lưu của Monkey D. Luffy và băng hải tặc Mũ Rơm trong hành trình trở thành Vua Hải Tặc',
    coverImage: '/manga/one-piece-banner.jpg',
  },
  {
    id: '2',
    title: 'Naruto',
    description: 'Câu chuyện về Naruto Uzumaki, một ninja trẻ tìm kiếm sự công nhận và ước mơ trở thành Hokage',
    coverImage: '/manga/naruto-banner.jpg',
  },
]

const latestManga = [
  {
    id: '1',
    title: 'One Piece',
    coverImage: '/manga/one-piece.jpg',
    status: 'ongoing',
    latestChapter: 1089,
    rating: 4.9,
    views: 1500000,
  },
  // Thêm các manga khác...
]

const popularManga = [
  {
    id: '2',
    title: 'Naruto',
    coverImage: '/manga/naruto.jpg',
    status: 'completed',
    latestChapter: 700,
    rating: 4.8,
    views: 2000000,
  },
  // Thêm các manga khác...
]

const selectedCategories = ref<number[]>([])
const filters = ref({
  completed: false,
  ongoing: false,
})
</script> 