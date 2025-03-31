<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Trending Manga Slider -->
    <section class="bg-gradient-to-b from-gray-800 to-gray-900 py-8">
      <div class="container mx-auto px-4">
        <swiper
          :modules="[Autoplay, Pagination, Navigation]"
          :slides-per-view="1"
          :loop="true"
          :autoplay="{ delay: 5000 }"
          :pagination="{ clickable: true }"
          :navigation="true"
          class="h-[400px] rounded-xl overflow-hidden"
        >
          <swiper-slide v-for="manga in trendingManga" :key="manga.id">
            <div class="relative h-full">
              <img 
                :src="manga.coverImage"
                :alt="manga.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <div class="absolute bottom-0 left-0 p-8">
                  <h1 class="text-4xl font-bold mb-4">{{ manga.title }}</h1>
                  <p class="text-lg text-gray-200 mb-6 max-w-2xl line-clamp-2">
                    {{ manga.description }}
                  </p>
                  <router-link 
                    :to="`/manga/${manga.id}`"
                    class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors inline-flex items-center"
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

    <!-- Daily Top Manga -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <i class="fas fa-fire text-red-500 mr-2"></i>
          Top truyện hôm nay
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <MangaCard v-for="manga in topManga" :key="manga.id" :manga="manga" />
        </div>
      </div>
    </section>

    <!-- Latest Updates -->
    <section class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-white">Mới cập nhật</h2>
        <router-link 
          to="/latest" 
          class="text-primary hover:text-primary-dark transition-colors"
        >
          Xem tất cả
        </router-link>
      </div>
      <div v-if="loading.latest" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      <div v-else-if="error.latest" class="text-red-500 text-center py-8">
        {{ error.latest }}
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <MangaCard 
          v-for="manga in latestMangas" 
          :key="manga.id" 
          :manga="manga"
        />
      </div>
    </section>

    <!-- Popular Manga -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-white">Phổ biến</h2>
        <router-link 
          to="/popular" 
          class="text-primary hover:text-primary-dark transition-colors"
        >
          Xem tất cả
        </router-link>
      </div>
      <div v-if="loading.popular" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      <div v-else-if="error.popular" class="text-red-500 text-center py-8">
        {{ error.popular }}
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <MangaCard 
          v-for="manga in popularMangas" 
          :key="manga.id" 
          :manga="manga"
        />
      </div>
    </section>

    <!-- Top Rated -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-white">Đánh giá cao</h2>
        <router-link 
          to="/top-rated" 
          class="text-primary hover:text-primary-dark transition-colors"
        >
          Xem tất cả
        </router-link>
      </div>
      <div v-if="loading.topRated" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      <div v-else-if="error.topRated" class="text-red-500 text-center py-8">
        {{ error.topRated }}
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <MangaCard 
          v-for="manga in topRatedMangas" 
          :key="manga.id" 
          :manga="manga"
        />
      </div>
    </section>
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
import type { Manga } from '@/services/api'

const trendingManga = ref<Manga[]>([
  {
    id: 'one-piece',
    title: 'One Piece',
    description: 'Luffy và đồng đội tiếp tục cuộc hành trình tìm kiếm kho báu vĩ đại nhất thế giới. Đọc ngay tập mới nhất!',
    coverImage: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    status: 'ongoing',
    categories: ['Action', 'Adventure'],
    latestChapter: 1089,
    views: 15000000,
    rating: 4.9,
    author: 'Eiichiro Oda',
    artist: 'Eiichiro Oda',
    releaseYear: '1997',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    description: 'Câu chuyện về Yuji Itadori, một học sinh trung học với khả năng thể chất phi thường, vô tình dính líu vào thế giới của Jujutsu.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/211807.jpg',
    status: 'ongoing',
    categories: ['Action', 'Supernatural'],
    latestChapter: 235,
    views: 9800000,
    rating: 4.8,
    author: 'Gege Akutami',
    artist: 'Gege Akutami',
    releaseYear: '2018',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    description: 'Denji là một thiếu niên nghèo đang cố trả nợ bằng cách săn quỷ cùng con quỷ Pochita. Sau khi bị phản bội và giết chết, anh hồi sinh với sức mạnh của Chainsaw Devil.',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
    status: 'ongoing',
    categories: ['Action', 'Horror'],
    latestChapter: 154,
    views: 8500000,
    rating: 4.7,
    author: 'Tatsuki Fujimoto',
    artist: 'Tatsuki Fujimoto',
    releaseYear: '2018',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
])

const topManga = ref<Manga[]>([
  {
    id: 'one-piece',
    title: 'One Piece',
    description: 'Theo chân cuộc phiêu lưu của Monkey D. Luffy...',
    coverImage: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    status: 'ongoing',
    categories: ['Action', 'Adventure'],
    latestChapter: 1089,
    views: 15000000,
    rating: 4.9,
    author: 'Eiichiro Oda',
    artist: 'Eiichiro Oda',
    releaseYear: '1997',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    description: 'Câu chuyện về Yuji Itadori, một học sinh trung học với khả năng thể chất phi thường...',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/211807.jpg',
    status: 'ongoing',
    categories: ['Action', 'Supernatural'],
    latestChapter: 235,
    views: 9800000,
    rating: 4.8,
    author: 'Gege Akutami',
    artist: 'Gege Akutami',
    releaseYear: '2018',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    description: 'Denji là một thiếu niên nghèo đang cố trả nợ bằng cách săn quỷ cùng con quỷ Pochita...',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
    status: 'ongoing',
    categories: ['Action', 'Horror'],
    latestChapter: 154,
    views: 8500000,
    rating: 4.7,
    author: 'Tatsuki Fujimoto',
    artist: 'Tatsuki Fujimoto',
    releaseYear: '2018',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    description: 'Câu chuyện về Tanjiro Kamado và em gái Nezuko trong hành trình chống lại quỷ dữ...',
    coverImage: 'https://cdn.myanimelist.net/images/manga/3/179023.jpg',
    status: 'completed',
    categories: ['Action', 'Supernatural'],
    latestChapter: 205,
    views: 12000000,
    rating: 4.8,
    author: 'Koyoharu Gotouge',
    artist: 'Koyoharu Gotouge',
    releaseYear: '2016',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'my-hero-academia',
    title: 'My Hero Academia',
    description: 'Trong thế giới nơi 80% dân số có siêu năng lực, Midoriya Izuku lại là người bình thường...',
    coverImage: 'https://cdn.myanimelist.net/images/manga/1/209370.jpg',
    status: 'ongoing',
    categories: ['Action', 'Superhero'],
    latestChapter: 403,
    views: 7800000,
    rating: 4.5,
    author: 'Kohei Horikoshi',
    artist: 'Kohei Horikoshi',
    releaseYear: '2014',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    description: 'Câu chuyện về cuộc chiến sinh tồn của nhân loại trước những Titan khổng lồ...',
    coverImage: 'https://cdn.myanimelist.net/images/manga/2/37846.jpg',
    status: 'completed',
    categories: ['Action', 'Mystery'],
    latestChapter: 139,
    views: 11000000,
    rating: 4.6,
    author: 'Hajime Isayama',
    artist: 'Hajime Isayama',
    releaseYear: '2009',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
])

const latestMangas = ref<Manga[]>([])
const popularMangas = ref<Manga[]>([])
const topRatedMangas = ref<Manga[]>([])

const loading = ref({
  latest: true,
  popular: true,
  topRated: true
})

const error = ref({
  latest: '',
  popular: '',
  topRated: ''
})

onMounted(async () => {
  // Fetch latest mangas
  try {
    latestMangas.value = await api.getLatestMangas()
  } catch (err) {
    error.value.latest = 'Không thể tải danh sách truyện mới'
  } finally {
    loading.value.latest = false
  }

  // Fetch popular mangas
  try {
    popularMangas.value = await api.getPopularMangas()
  } catch (err) {
    error.value.popular = 'Không thể tải danh sách truyện phổ biến'
  } finally {
    loading.value.popular = false
  }

  // Fetch top rated mangas
  try {
    const allMangas = await api.getAllMangas()
    topRatedMangas.value = [...allMangas].sort((a, b) => b.rating - a.rating).slice(0, 12)
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