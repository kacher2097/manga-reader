<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// Component logic here
</script>

<template>
  <div class="min-h-screen bg-background text-white">
    <header class="fixed top-0 left-0 right-0 h-header bg-background/95 backdrop-blur-sm z-50">
      <nav class="max-w-container mx-auto px-4 h-full flex items-center justify-between">
        <!-- Logo -->
        <div class="text-2xl font-anime text-primary">
          MangaHub
        </div>

        <!-- Search Bar -->
        <div class="relative w-[300px]">
          <input 
            type="text" 
            placeholder="Tìm kiếm manga..." 
            class="w-full px-4 py-2 bg-background-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
          <span class="absolute right-3 top-1/2 -translate-y-1/2">
            🔍
          </span>
        </div>

        <!-- Navigation Menu -->
        <div class="flex items-center gap-6">
          <a href="#" class="hover:text-primary transition-colors">Trang chủ</a>
          <a href="#" class="hover:text-primary transition-colors">Thể loại</a>
          <a href="#" class="hover:text-primary transition-colors">Mới nhất</a>
          <a href="#" class="hover:text-primary transition-colors">Yêu thích</a>
          <button class="px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors">
            Đăng nhập
          </button>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="h-hero mt-header relative bg-[url('/hero-bg.jpg')] bg-cover bg-center">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative max-w-container mx-auto px-4 h-full flex flex-col justify-center">
        <h1 class="text-4xl font-bold mb-4">One Piece</h1>
        <p class="text-gray-300 max-w-xl mb-6">
          Theo chân cuộc phiêu lưu của Monkey D. Luffy và băng hải tặc Mũ Rơm trong hành trình trở thành Vua Hải Tặc
        </p>
        <button class="px-6 py-3 bg-primary rounded-lg hover:bg-primary-dark transition-colors w-fit">
          Đọc ngay
        </button>
      </div>
    </section>

    <!-- Main Content -->
    <main class="max-w-container mx-auto px-4 py-12">
      <div class="flex gap-8">
        <!-- Sidebar -->
        <aside class="w-[300px] shrink-0">
          <div class="bg-background-light rounded-lg p-4">
            <h2 class="text-xl font-bold mb-4">Thể loại</h2>
            <div class="space-y-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="accent-primary">
                <span>Shonen</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="accent-primary">
                <span>Shojo</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="accent-primary">
                <span>Seinen</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Manga Grid -->
        <div class="flex-1">
          <div class="grid grid-cols-4 gap-6">
            <!-- Manga Card -->
            <div class="bg-background-light rounded-lg overflow-hidden">
              <img alt="Manga Cover" class="w-full aspect-[2/3] object-cover">
              <div class="p-4">
                <h3 class="font-bold mb-2">Naruto</h3>
                <p class="text-sm text-gray-400">Chapter 700</p>
                <div class="flex items-center gap-1 mt-2">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
            <!-- Repeat manga cards -->
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-background">
      <div class="max-w-container mx-auto px-4 py-12">
        <div class="grid grid-cols-3 gap-8">
          <div>
            <h2 class="text-2xl font-anime text-primary mb-4">MangaHub</h2>
            <p class="text-gray-400">
              Nền tảng đọc manga trực tuyến hàng đầu Việt Nam
            </p>
          </div>
          <div>
            <h3 class="font-bold mb-4">Liên kết</h3>
            <div class="space-y-2">
              <a href="#" class="block text-gray-400 hover:text-primary">Chính sách</a>
              <a href="#" class="block text-gray-400 hover:text-primary">Liên hệ</a>
              <a href="#" class="block text-gray-400 hover:text-primary">FAQ</a>
            </div>
          </div>
          <div>
            <h3 class="font-bold mb-4">Mạng xã hội</h3>
            <div class="flex gap-4">
              <a href="#" class="text-gray-400 hover:text-primary">FB</a>
              <a href="#" class="text-gray-400 hover:text-primary">DC</a>
              <a href="#" class="text-gray-400 hover:text-primary">TW</a>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          © 2025 MangaHub. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

</style>
