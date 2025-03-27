<template>
  <!-- Footer -->
  <footer class="bg-gray-800 text-gray-400 py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- About -->
          <!-- <div>
            <h3 class="text-white text-lg font-bold mb-4">Về MangaHub</h3>
            <p class="text-sm">
              Nền tảng đọc manga trực tuyến hàng đầu Việt Nam với kho truyện đa dạng và cập nhật nhanh nhất.
            </p>
          </div> -->
          <div class="md:col-span-1">
          <router-link to="/" class="flex items-center space-x-2 mb-4">
            <span class="text-2xl font-bold text-red-500">Manga<span class="text-white">Hub</span></span>
          </router-link>
          <p class="text-sm mb-4">
            Website đọc truyện manga, manhua, manhwa online tiếng Việt chất lượng cao, cập nhật nhanh và đủ thể loại.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <i class="fab fa-discord"></i>
            </a>
          </div>
        </div>
<!-- Danh mục -->
<div class="md:col-span-1">
          <h4 class="text-white text-lg font-medium mb-4">Danh mục</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/latest" class="text-gray-400 hover:text-white transition-colors">
                Mới cập nhật
              </router-link>
            </li>
            <li>
              <router-link to="/popular" class="text-gray-400 hover:text-white transition-colors">
                Phổ biến
              </router-link>
            </li>
            <li>
              <router-link to="/categories" class="text-gray-400 hover:text-white transition-colors">
                Thể loại
              </router-link>
            </li>
            <li>
              <router-link to="/completed" class="text-gray-400 hover:text-white transition-colors">
                Đã hoàn thành
              </router-link>
            </li>
            <li>
              <router-link to="/search" class="text-gray-400 hover:text-white transition-colors">
                Tìm kiếm nâng cao
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Tiện ích -->
        <div class="md:col-span-1">
          <h4 class="text-white text-lg font-medium mb-4">Tiện ích</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/history" class="text-gray-400 hover:text-white transition-colors">
                Lịch sử đọc truyện
              </router-link>
            </li>
            <li>
              <router-link to="/favorites" class="text-gray-400 hover:text-white transition-colors">
                Truyện yêu thích
              </router-link>
            </li>
            <li>
              <router-link to="/following" class="text-gray-400 hover:text-white transition-colors">
                Truyện đang theo dõi
              </router-link>
            </li>
            <li>
              <router-link to="/settings" class="text-gray-400 hover:text-white transition-colors">
                Cài đặt
              </router-link>
            </li>
            <li>
              <a href="#" @click.prevent="scrollToTop" class="text-gray-400 hover:text-white transition-colors">
                Trở lên trên
              </a>
            </li>
          </ul>
        </div>
          <!-- Quick Links -->
          <!-- Thông tin -->
        <div class="md:col-span-1">
          <h4 class="text-white text-lg font-medium mb-4">Thông tin</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/about" class="text-gray-400 hover:text-white transition-colors">
                Giới thiệu
              </router-link>
            </li>
            <li>
              <router-link to="/privacy" class="text-gray-400 hover:text-white transition-colors">
                Chính sách riêng tư
              </router-link>
            </li>
            <li>
              <router-link to="/terms" class="text-gray-400 hover:text-white transition-colors">
                Điều khoản sử dụng
              </router-link>
            </li>
            <li>
              <router-link to="/dmca" class="text-gray-400 hover:text-white transition-colors">
                DMCA
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="text-gray-400 hover:text-white transition-colors">
                Liên hệ
              </router-link>
            </li>
          </ul>
        </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p class="text-sm">
            © {{ currentYear }} MangaHub. All rights reserved.
            </p>
            <p class="text-xs mt-2">
            Nội dung trên trang web này chỉ dành cho mục đích giải trí và giáo dục.
            Tất cả các tác phẩm đều thuộc bản quyền của tác giả và nhà xuất bản tương ứng.
            </p>
        </div>
      </div>
    </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
/* Footer styles */
</style> 