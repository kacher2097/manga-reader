<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <TheNavigation />

    <!-- Main Content -->
    <main>
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-400 py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- About -->
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Về MangaHub</h3>
            <p class="text-sm">
              Nền tảng đọc manga trực tuyến hàng đầu Việt Nam với kho truyện đa dạng và cập nhật nhanh nhất.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Liên kết</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <router-link to="/terms" class="hover:text-red-500 transition-colors">
                  Điều khoản sử dụng
                </router-link>
              </li>
              <li>
                <router-link to="/privacy" class="hover:text-red-500 transition-colors">
                  Chính sách bảo mật
                </router-link>
              </li>
              <li>
                <router-link to="/dmca" class="hover:text-red-500 transition-colors">
                  DMCA
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Hỗ trợ</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <router-link to="/faq" class="hover:text-red-500 transition-colors">
                  FAQ
                </router-link>
              </li>
              <li>
                <router-link to="/contact" class="hover:text-red-500 transition-colors">
                  Liên hệ
                </router-link>
              </li>
              <li>
                <router-link to="/report" class="hover:text-red-500 transition-colors">
                  Báo lỗi
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Community -->
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Cộng đồng</h3>
            <div class="flex space-x-4">
              <a href="#" class="hover:text-red-500 transition-colors">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="hover:text-red-500 transition-colors">
                <i class="fab fa-discord"></i>
              </a>
              <a href="#" class="hover:text-red-500 transition-colors">
                <i class="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          © 2024 MangaHub. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import TheNavigation from './components/TheNavigation.vue'
</script>

<style>
/* Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
</style>
