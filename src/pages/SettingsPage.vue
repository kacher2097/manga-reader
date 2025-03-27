<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Cài đặt</h1>
        <p class="text-gray-400">Tùy chỉnh trải nghiệm đọc manga của bạn</p>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-700 mb-8">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            <i :class="['mr-2', tab.icon]"></i>
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Appearance Settings -->
      <div v-if="activeTab === 'appearance'" class="space-y-8">
        <div>
          <h2 class="text-xl font-bold text-white mb-4">Giao diện</h2>
          
          <!-- Theme -->
          <div class="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-white mb-4">Chủ đề</h3>
            <div class="grid grid-cols-3 gap-4">
              <button
                @click="settings.theme = 'dark'"
                :class="[
                  'p-4 rounded-lg border-2 flex flex-col items-center',
                  settings.theme === 'dark'
                    ? 'border-red-500'
                    : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <div class="w-full h-20 bg-gray-900 rounded mb-2"></div>
                <span :class="settings.theme === 'dark' ? 'text-red-500' : 'text-white'">
                  Tối
                </span>
              </button>
              <button
                @click="settings.theme = 'light'"
                :class="[
                  'p-4 rounded-lg border-2 flex flex-col items-center',
                  settings.theme === 'light'
                    ? 'border-red-500'
                    : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <div class="w-full h-20 bg-gray-100 rounded mb-2"></div>
                <span :class="settings.theme === 'light' ? 'text-red-500' : 'text-white'">
                  Sáng
                </span>
              </button>
              <button
                @click="settings.theme = 'system'"
                :class="[
                  'p-4 rounded-lg border-2 flex flex-col items-center',
                  settings.theme === 'system'
                    ? 'border-red-500'
                    : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <div class="w-full h-20 bg-gradient-to-r from-gray-900 to-gray-100 rounded mb-2"></div>
                <span :class="settings.theme === 'system' ? 'text-red-500' : 'text-white'">
                  Hệ thống
                </span>
              </button>
            </div>
          </div>

          <!-- Font Size -->
          <div class="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-white mb-4">Cỡ chữ</h3>
            <div class="flex items-center">
              <span class="text-sm text-white mr-3">A</span>
              <input
                type="range"
                v-model="settings.fontSize"
                min="12"
                max="20"
                step="1"
                class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <span class="text-lg text-white ml-3">A</span>
            </div>
            <div class="mt-4 p-4 bg-gray-700 rounded">
              <p :style="`font-size: ${settings.fontSize}px`" class="text-white">
                Đây là ví dụ về cỡ chữ được chọn. Bạn có thể điều chỉnh để phù hợp với nhu cầu đọc của mình.
              </p>
            </div>
          </div>

          <!-- Animation -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-4">Hiệu ứng</h3>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-white">Hiệu ứng chuyển trang</div>
                <div class="text-sm text-gray-400">Hiển thị hiệu ứng khi chuyển trang</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="settings.animations"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Reading Settings -->
      <div v-if="activeTab === 'reading'" class="space-y-8">
        <div>
          <h2 class="text-xl font-bold text-white mb-4">Đọc manga</h2>
          
          <!-- Reading Mode -->
          <div class="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-white mb-4">Chế độ đọc</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                @click="settings.readingMode = 'vertical'"
                :class="[
                  'p-4 rounded-lg border-2 flex flex-col items-center',
                  settings.readingMode === 'vertical'
                    ? 'border-red-500'
                    : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <div class="w-full aspect-[3/4] bg-gray-700 rounded mb-2 flex flex-col items-center justify-center">
                  <div class="w-3/4 h-3 bg-gray-600 rounded mb-2"></div>
                  <div class="w-3/4 h-3 bg-gray-600 rounded mb-2"></div>
                  <div class="w-3/4 h-3 bg-gray-600 rounded"></div>
                </div>
                <span :class="settings.readingMode === 'vertical' ? 'text-red-500' : 'text-white'">
                  Cuộn dọc
                </span>
              </button>
              <button
                @click="settings.readingMode = 'horizontal'"
                :class="[
                  'p-4 rounded-lg border-2 flex flex-col items-center',
                  settings.readingMode === 'horizontal'
                    ? 'border-red-500'
                    : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <div class="w-full aspect-[3/4] bg-gray-700 rounded mb-2 flex items-center justify-center">
                  <i class="fas fa-arrows-left-right text-gray-600"></i>
                </div>
                <span :class="settings.readingMode === 'horizontal' ? 'text-red-500' : 'text-white'">
                  Cuộn ngang
                </span>
              </button>
              <button
                @click="settings.readingMode = 'single'"
                :class="[
                  'p-4 rounded-lg border-2 flex flex-col items-center',
                  settings.readingMode === 'single'
                    ? 'border-red-500'
                    : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <div class="w-full aspect-[3/4] bg-gray-700 rounded mb-2 flex items-center justify-center">
                  <i class="fas fa-book-open text-gray-600"></i>
                </div>
                <span :class="settings.readingMode === 'single' ? 'text-red-500' : 'text-white'">
                  Một trang
                </span>
              </button>
            </div>
          </div>

          <!-- Image Quality -->
          <div class="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-white mb-4">Chất lượng ảnh</h3>
            <div class="space-y-3">
              <div
                v-for="quality in imageQualities"
                :key="quality.value"
                :class="[
                  'flex items-center justify-between p-3 rounded',
                  settings.imageQuality === quality.value ? 'bg-red-500/20' : 'bg-gray-700'
                ]"
              >
                <div>
                  <div :class="settings.imageQuality === quality.value ? 'text-red-500' : 'text-white'">
                    {{ quality.label }}
                  </div>
                  <div class="text-sm text-gray-400">{{ quality.description }}</div>
                </div>
                <input
                  type="radio"
                  :checked="settings.imageQuality === quality.value"
                  @change="settings.imageQuality = quality.value"
                  :id="quality.value"
                  :value="quality.value"
                  name="imageQuality"
                  class="w-4 h-4 accent-red-500"
                />
              </div>
            </div>
          </div>

          <!-- Auto Next Chapter -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-4">Tự động</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white">Tự động chuyển chapter</div>
                  <div class="text-sm text-gray-400">Tự động chuyển sang chapter tiếp theo khi đọc hết</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="settings.autoNextChapter"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white">Lưu vị trí đọc</div>
                  <div class="text-sm text-gray-400">Tự động lưu và khôi phục vị trí đọc</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="settings.saveReadingPosition"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div v-if="activeTab === 'account'" class="space-y-8">
        <div>
          <h2 class="text-xl font-bold text-white mb-4">Tài khoản</h2>
          
          <!-- Email Notifications -->
          <div class="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-white mb-4">Thông báo qua email</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white">Manga mới</div>
                  <div class="text-sm text-gray-400">Thông báo khi có manga mới được thêm vào thư viện</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="settings.notifications.newManga"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white">Chapter mới</div>
                  <div class="text-sm text-gray-400">Thông báo khi có chapter mới từ manga bạn đang theo dõi</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="settings.notifications.newChapter"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white">Bình luận</div>
                  <div class="text-sm text-gray-400">Thông báo khi có người trả lời bình luận của bạn</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="settings.notifications.comments"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Privacy -->
          <div class="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-white mb-4">Quyền riêng tư</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white">Lịch sử đọc công khai</div>
                  <div class="text-sm text-gray-400">Cho phép người khác xem lịch sử đọc của bạn</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="settings.privacy.publicHistory"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white">Danh sách theo dõi công khai</div>
                  <div class="text-sm text-gray-400">Cho phép người khác xem manga bạn đang theo dõi</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="settings.privacy.publicFollowing"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Data -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-medium text-white mb-4">Dữ liệu</h3>
            <div class="space-y-4">
              <button
                @click="exportData"
                class="w-full px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <i class="fas fa-download mr-2"></i>
                Xuất dữ liệu
              </button>
              <button
                @click="clearData"
                class="w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <i class="fas fa-trash mr-2"></i>
                Xóa tất cả dữ liệu
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-8 flex justify-end">
        <button
          @click="saveSettings"
          class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Lưu cài đặt
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabs = [
  { id: 'appearance', name: 'Giao diện', icon: 'fas fa-palette' },
  { id: 'reading', name: 'Đọc manga', icon: 'fas fa-book-reader' },
  { id: 'account', name: 'Tài khoản', icon: 'fas fa-user-cog' }
]

const activeTab = ref('appearance')

// Image qualities
const imageQualities = [
  {
    value: 'high',
    label: 'Cao (HD)',
    description: 'Chất lượng cao nhất, tốn nhiều dữ liệu'
  },
  {
    value: 'medium',
    label: 'Trung bình',
    description: 'Cân bằng giữa chất lượng và dữ liệu'
  },
  {
    value: 'low',
    label: 'Thấp',
    description: 'Tiết kiệm dữ liệu, phù hợp với mạng chậm'
  }
]

// Settings
const settings = ref({
  theme: 'dark',
  fontSize: 16,
  animations: true,
  readingMode: 'vertical',
  imageQuality: 'high',
  autoNextChapter: true,
  saveReadingPosition: true,
  notifications: {
    newManga: true,
    newChapter: true,
    comments: false
  },
  privacy: {
    publicHistory: false,
    publicFollowing: true
  }
})

// Save settings
const saveSettings = () => {
  // TODO: Save settings to API/localStorage
  console.log('Saving settings:', settings.value)
  alert('Cài đặt đã được lưu!')
}

// Export data
const exportData = () => {
  // TODO: Implement data export
  console.log('Exporting data')
  alert('Dữ liệu đã được xuất!')
}

// Clear data
const clearData = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.')) {
    // TODO: Implement data clearing
    console.log('Clearing data')
    alert('Dữ liệu đã được xóa!')
  }
}
</script> 