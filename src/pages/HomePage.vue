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
                :src="manga.cover"
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
    <section class="py-8">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <i class="fas fa-clock text-blue-500 mr-2"></i>
          Mới cập nhật
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <MangaCard v-for="manga in latestManga" :key="manga.id" :manga="manga" />
        </div>
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
        </div>
        <div v-if="!loading && hasMore" class="text-center py-6">
          <button 
            @click="loadMore" 
            class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Xem thêm
          </button>
        </div>
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

// Define Manga type
interface Manga {
  id: string;
  title: string;
  cover: string;
  status: 'ongoing' | 'completed';
  latestChapter: number;
  views: number;
  rating: number;
}

const trendingManga = ref([
  {
    id: 'one-piece',
    title: 'One Piece',
    cover: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    description: 'Luffy và đồng đội tiếp tục cuộc hành trình tìm kiếm kho báu vĩ đại nhất thế giới. Đọc ngay tập mới nhất!'
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    cover: 'https://cdn.myanimelist.net/images/manga/3/211807.jpg',
    description: 'Câu chuyện về Yuji Itadori, một học sinh trung học với khả năng thể chất phi thường, vô tình dính líu vào thế giới của Jujutsu.'
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    cover: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
    description: 'Denji là một thiếu niên nghèo đang cố trả nợ bằng cách săn quỷ cùng con quỷ Pochita. Sau khi bị phản bội và giết chết, anh hồi sinh với sức mạnh của Chainsaw Devil.'
  }
])

const topManga = ref<Manga[]>([
  {
    id: 'one-piece',
    title: 'One Piece',
    cover: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    status: 'ongoing',
    latestChapter: 1089,
    views: 15000000,
    rating: 4.9
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    cover: 'https://cdn.myanimelist.net/images/manga/3/211807.jpg',
    status: 'ongoing',
    latestChapter: 235,
    views: 9800000,
    rating: 4.8
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    cover: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
    status: 'ongoing',
    latestChapter: 154,
    views: 8500000,
    rating: 4.7
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    cover: 'https://cdn.myanimelist.net/images/manga/3/179023.jpg',
    status: 'completed',
    latestChapter: 205,
    views: 12000000,
    rating: 4.8
  },
  {
    id: 'my-hero-academia',
    title: 'My Hero Academia',
    cover: 'https://cdn.myanimelist.net/images/manga/1/209370.jpg',
    status: 'ongoing',
    latestChapter: 403,
    views: 7800000,
    rating: 4.5
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    cover: 'https://cdn.myanimelist.net/images/manga/2/37846.jpg',
    status: 'completed',
    latestChapter: 139,
    views: 11000000,
    rating: 4.6
  }
])

const latestManga = ref<Manga[]>([])
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)

const loadMore = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add more manga to the list
    latestManga.value.push(...generateMoreManga())
    page.value++
    
    // After page 5, no more data
    if (page.value >= 5) {
      hasMore.value = false
    }
  } finally {
    loading.value = false
  }
}

const generateMoreManga = (): Manga[] => {
  // Sample manga titles
  const titles = [
    'Dragon Ball', 'Naruto', 'Bleach', 'Tokyo Ghoul', 
    'Death Note', 'Fullmetal Alchemist', 'Hunter x Hunter',
    'One Punch Man', 'Spy x Family', 'Black Clover',
    'Boruto', 'Dr. Stone', 'Tower of God', 'Solo Leveling'
  ]
  
  // Sample cover images - using actual manga cover URLs
  const covers = [
    'https://cdn.myanimelist.net/images/manga/2/253146.jpg', // One Piece
    'https://cdn.myanimelist.net/images/manga/3/216464.jpg', // Chainsaw Man
    'https://cdn.myanimelist.net/images/manga/3/211807.jpg', // Jujutsu Kaisen
    'https://cdn.myanimelist.net/images/manga/3/179023.jpg', // Demon Slayer
    'https://cdn.myanimelist.net/images/manga/1/209370.jpg', // My Hero Academia
    'https://cdn.myanimelist.net/images/manga/2/37846.jpg',  // Attack on Titan
    'https://cdn.myanimelist.net/images/manga/1/157897.jpg', // Tokyo Ghoul
    'https://cdn.myanimelist.net/images/manga/1/258213.jpg', // Spy x Family
    'https://cdn.myanimelist.net/images/manga/2/181125.jpg', // Hunter x Hunter
    'https://cdn.myanimelist.net/images/manga/3/188896.jpg', // One Punch Man
    'https://cdn.myanimelist.net/images/manga/2/161476.jpg', // Dragon Ball
    'https://cdn.myanimelist.net/images/manga/3/216933.jpg', // Solo Leveling
  ]
  
  // Generate data for 12 manga
  return Array(12).fill(null).map((_, index) => {
    const titleIndex = Math.floor(Math.random() * titles.length)
    const coverIndex = Math.floor(Math.random() * covers.length)
    const isOngoing = Math.random() > 0.3
    
    const uniqueId = `manga-${page.value}-${index}`
    
    return {
      id: uniqueId,
      title: `${titles[titleIndex]} ${page.value > 1 ? page.value : ''}`,
      cover: covers[coverIndex],
      status: isOngoing ? 'ongoing' : 'completed',
      latestChapter: Math.floor(Math.random() * 900) + 100,
      views: Math.floor(Math.random() * 9000000) + 1000000,
      rating: Number((4 + Math.random()).toFixed(1))
    }
  })
}

onMounted(() => {
  loadMore()
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