<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Cài đặt hệ thống</h1>
      <button class="bg-primary hover:bg-red-500 text-white px-4 py-2 rounded-md transition-colors flex items-center">
        <i class="fas fa-save mr-2"></i> Lưu thay đổi
      </button>
    </div>

    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Cài đặt chung -->
        <div>
          <h2 class="text-xl font-semibold mb-4">Cài đặt chung</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Tên trang web</label>
              <input 
                type="text" 
                v-model="settings.siteName" 
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Mô tả</label>
              <textarea 
                v-model="settings.siteDescription" 
                rows="3" 
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Logo URL</label>
              <input 
                type="text" 
                v-model="settings.logoUrl" 
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Favicon URL</label>
              <input 
                type="text" 
                v-model="settings.faviconUrl" 
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <!-- Cài đặt nâng cao -->
        <div>
          <h2 class="text-xl font-semibold mb-4">Cài đặt nâng cao</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Số manga trên mỗi trang</label>
              <input 
                type="number" 
                v-model="settings.mangaPerPage" 
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Số chapter trên mỗi trang</label>
              <input 
                type="number" 
                v-model="settings.chaptersPerPage" 
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="maintenance-mode" 
                v-model="settings.maintenanceMode" 
                class="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary focus:ring-offset-gray-800"
              />
              <label for="maintenance-mode" class="ml-2 text-sm font-medium text-gray-300">
                Chế độ bảo trì
              </label>
            </div>
            
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="enable-cache" 
                v-model="settings.enableCache" 
                class="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary focus:ring-offset-gray-800"
              />
              <label for="enable-cache" class="ml-2 text-sm font-medium text-gray-300">
                Bật bộ nhớ cache
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Cài đặt SEO -->
    <div class="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Cài đặt SEO</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Tiêu đề SEO</label>
          <input 
            type="text" 
            v-model="settings.seoTitle" 
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Mô tả SEO</label>
          <textarea 
            v-model="settings.seoDescription" 
            rows="3" 
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Từ khóa SEO (phân cách bằng dấu phẩy)</label>
          <input 
            type="text" 
            v-model="settings.seoKeywords" 
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="enable-sitemap" 
            v-model="settings.enableSitemap" 
            class="rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary focus:ring-offset-gray-800"
          />
          <label for="enable-sitemap" class="ml-2 text-sm font-medium text-gray-300">
            Tự động tạo sitemap
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Dữ liệu mẫu
const settings = ref({
  siteName: 'Manga Reader',
  siteDescription: 'Trang web đọc truyện manga online miễn phí và cập nhật nhanh nhất',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
  mangaPerPage: 20,
  chaptersPerPage: 50,
  maintenanceMode: false,
  enableCache: true,
  seoTitle: 'Manga Reader - Đọc truyện manga online miễn phí',
  seoDescription: 'Đọc truyện manga online miễn phí, cập nhật nhanh nhất các bộ truyện manga hot nhất hiện nay.',
  seoKeywords: 'manga, truyện tranh, truyện manga, đọc truyện online, manga online',
  enableSitemap: true
})

// Xử lý lưu cài đặt
function saveSettings() {
  // Gửi dữ liệu đến API
  console.log('Lưu cài đặt:', settings.value)
  // Hiển thị thông báo thành công
}
</script>

<style scoped>
.text-primary {
  color: #FF6B6B;
}

.bg-primary {
  background-color: #FF6B6B;
}

.focus\:ring-primary:focus {
  --tw-ring-color: rgba(255, 107, 107, var(--tw-ring-opacity));
}

.text-primary {
  color: #FF6B6B;
}

.border-primary {
  border-color: #FF6B6B;
}
</style> 