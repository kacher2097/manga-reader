<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">Thể loại manga</h1>
        <p class="text-gray-400">Khám phá manga theo thể loại yêu thích của bạn</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <router-link :to="`/category/${category.id}`">
            <div class="relative h-48">
              <img
                :src="category.image"
                :alt="category.name"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-xl font-semibold text-white mb-1">{{ category.name }}</h3>
                <p class="text-sm text-gray-300">{{ category.mangaCount }} manga</p>
              </div>
            </div>
            <div class="p-4">
              <p class="text-gray-400 text-sm line-clamp-2">{{ category.description }}</p>
              <div class="mt-4 flex items-center justify-between">
                <span class="text-red-500 font-medium">Xem tất cả</span>
                <i class="fas fa-arrow-right text-red-500"></i>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const categories = [
  {
    id: 'action',
    name: 'Action',
    description: 'Thể loại này thường có nội dung về đánh nhau, bạo lực, hỗn loạn, với diễn biến nhanh.',
    image: 'https://example.com/images/categories/action.jpg',
    mangaCount: 1234
  },
  {
    id: 'romance',
    name: 'Romance',
    description: 'Thể loại lãng mạn, tình cảm, thường là những câu chuyện về tình yêu.',
    image: 'https://example.com/images/categories/romance.jpg',
    mangaCount: 987
  },
  {
    id: 'comedy',
    name: 'Comedy',
    description: 'Thể loại có nội dung hài hước, đem lại tiếng cười cho độc giả.',
    image: 'https://example.com/images/categories/comedy.jpg',
    mangaCount: 856
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Thể loại xuất hiện những nhân vật, sự việc mang tính chất phép thuật, kỳ ảo.',
    image: 'https://example.com/images/categories/fantasy.jpg',
    mangaCount: 743
  },
  {
    id: 'horror',
    name: 'Horror',
    description: 'Thể loại kinh dị, rùng rợn, ghê sợ, có thể gây shock cho người xem.',
    image: 'https://example.com/images/categories/horror.jpg',
    mangaCount: 321
  },
  {
    id: 'sci-fi',
    name: 'Sci-fi',
    description: 'Thể loại khoa học viễn tưởng, có nội dung về khoa học, công nghệ.',
    image: 'https://example.com/images/categories/sci-fi.jpg',
    mangaCount: 432
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Thể loại có nội dung về thể thao, các môn thể thao và tinh thần thể thao.',
    image: 'https://example.com/images/categories/sports.jpg',
    mangaCount: 234
  },
  {
    id: 'mystery',
    name: 'Mystery',
    description: 'Thể loại thường xuất hiện những điều bí ẩn, những câu đố cần giải mã.',
    image: 'https://example.com/images/categories/mystery.jpg',
    mangaCount: 543
  },
  {
    id: 'slice-of-life',
    name: 'Slice of Life',
    description: 'Thể loại phản ánh đời sống thường ngày, những câu chuyện đời thường.',
    image: 'https://example.com/images/categories/slice-of-life.jpg',
    mangaCount: 654
  },
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'Thể loại phiêu lưu, mạo hiểm, thường là hành trình của các nhân vật.',
    image: 'https://example.com/images/categories/adventure.jpg',
    mangaCount: 876
  },
  {
    id: 'drama',
    name: 'Drama',
    description: 'Thể loại mang đến những cảm xúc mạnh mẽ: buồn bã, căng thẳng, xúc động.',
    image: 'https://example.com/images/categories/drama.jpg',
    mangaCount: 765
  },
  {
    id: 'supernatural',
    name: 'Supernatural',
    description: 'Thể loại siêu nhiên, thường xuất hiện những sự việc vượt quá sức tưởng tượng.',
    image: 'https://example.com/images/categories/supernatural.jpg',
    mangaCount: 432
  }
]
</script> 