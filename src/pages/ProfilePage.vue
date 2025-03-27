<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Thông tin cá nhân</h1>
        <p class="text-gray-400">Quản lý thông tin và cài đặt tài khoản của bạn</p>
      </div>

      <!-- Profile Info -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8">
        <div class="flex items-start gap-6">
          <!-- Avatar -->
          <div class="shrink-0">
            <div class="relative w-24 h-24 rounded-full overflow-hidden">
              <img
                :src="user.avatar"
                :alt="user.username"
                class="w-full h-full object-cover"
              />
              <button
                @click="changeAvatar"
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200"
              >
                <i class="fas fa-camera text-white"></i>
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-2xl font-bold text-white">{{ user.username }}</h2>
                <p class="text-gray-400">Tham gia từ {{ user.joinDate }}</p>
              </div>
              <button
                @click="editProfile = true"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <i class="fas fa-edit mr-2"></i>
                Chỉnh sửa
              </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-gray-700 rounded-lg">
                <div class="text-2xl font-bold text-white">{{ user.stats.following }}</div>
                <div class="text-sm text-gray-400">Đang theo dõi</div>
              </div>
              <div class="text-center p-4 bg-gray-700 rounded-lg">
                <div class="text-2xl font-bold text-white">{{ user.stats.completed }}</div>
                <div class="text-sm text-gray-400">Đã hoàn thành</div>
              </div>
              <div class="text-center p-4 bg-gray-700 rounded-lg">
                <div class="text-2xl font-bold text-white">{{ user.stats.chapters }}</div>
                <div class="text-sm text-gray-400">Chapter đã đọc</div>
              </div>
              <div class="text-center p-4 bg-gray-700 rounded-lg">
                <div class="text-2xl font-bold text-white">{{ user.stats.comments }}</div>
                <div class="text-sm text-gray-400">Bình luận</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-bold text-white mb-6">Cài đặt tài khoản</h2>

        <!-- Email -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-white mb-4">Email</h3>
          <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <div class="text-white">{{ user.email }}</div>
              <div class="text-sm text-gray-400">
                <i class="fas fa-check-circle text-green-500 mr-1"></i>
                Đã xác thực
              </div>
            </div>
            <button
              @click="changeEmail = true"
              class="text-red-500 hover:text-red-400"
            >
              Thay đổi
            </button>
          </div>
        </div>

        <!-- Password -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-white mb-4">Mật khẩu</h3>
          <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <div class="text-white">••••••••</div>
              <div class="text-sm text-gray-400">Cập nhật lần cuối 2 tháng trước</div>
            </div>
            <button
              @click="changePassword = true"
              class="text-red-500 hover:text-red-400"
            >
              Thay đổi
            </button>
          </div>
        </div>

        <!-- Notifications -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-white mb-4">Thông báo</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-white">Thông báo qua email</div>
                <div class="text-sm text-gray-400">Nhận thông báo về manga mới và cập nhật</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="settings.emailNotifications"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-white">Thông báo trên trình duyệt</div>
                <div class="text-sm text-gray-400">Nhận thông báo khi có chapter mới</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="settings.browserNotifications"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Reading Preferences -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-white mb-4">Tùy chọn đọc</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-white mb-2">Chế độ đọc mặc định</label>
              <select
                v-model="settings.defaultReadingMode"
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="vertical">Cuộn dọc</option>
                <option value="horizontal">Cuộn ngang</option>
                <option value="single">Một trang</option>
              </select>
            </div>
            <div>
              <label class="block text-white mb-2">Chất lượng ảnh mặc định</label>
              <select
                v-model="settings.defaultImageQuality"
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="high">Cao (HD)</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp (Tiết kiệm data)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div>
          <h3 class="text-lg font-medium text-red-500 mb-4">Vùng nguy hiểm</h3>
          <div class="p-4 bg-gray-700 rounded-lg border border-red-500">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-white">Xóa tài khoản</div>
                <div class="text-sm text-gray-400">Xóa vĩnh viễn tài khoản và dữ liệu của bạn</div>
              </div>
              <button
                @click="deleteAccount"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div
        v-if="editProfile"
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="relative bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-bold text-white mb-4">Chỉnh sửa thông tin</h3>
          <form @submit.prevent="saveProfile">
            <div class="mb-4">
              <label class="block text-white mb-2">Tên hiển thị</label>
              <input
                type="text"
                v-model="editForm.username"
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-white mb-2">Giới thiệu</label>
              <textarea
                v-model="editForm.bio"
                rows="3"
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>
            <div class="flex justify-end gap-4">
              <button
                type="button"
                @click="editProfile = false"
                class="px-4 py-2 text-gray-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Change Email Modal -->
      <div
        v-if="changeEmail"
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="relative bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-bold text-white mb-4">Thay đổi email</h3>
          <form @submit.prevent="updateEmail">
            <div class="mb-4">
              <label class="block text-white mb-2">Email mới</label>
              <input
                type="email"
                v-model="emailForm.newEmail"
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-white mb-2">Mật khẩu</label>
              <input
                type="password"
                v-model="emailForm.password"
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div class="flex justify-end gap-4">
              <button
                type="button"
                @click="changeEmail = false"
                class="px-4 py-2 text-gray-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Change Password Modal -->
      <div
        v-if="changePassword"
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="relative bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-bold text-white mb-4">Thay đổi mật khẩu</h3>
          <form @submit.prevent="updatePassword">
            <div class="mb-4">
              <label class="block text-white mb-2">Mật khẩu hiện tại</label>
              <input
                type="password"
                v-model="passwordForm.currentPassword"
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-white mb-2">Mật khẩu mới</label>
              <input
                type="password"
                v-model="passwordForm.newPassword"
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-white mb-2">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                v-model="passwordForm.confirmPassword"
                class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div class="flex justify-end gap-4">
              <button
                type="button"
                @click="changePassword = false"
                class="px-4 py-2 text-gray-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Mock user data
const user = ref({
  username: 'MangaReader',
  email: 'example@email.com',
  avatar: 'https://example.com/images/avatar.jpg',
  joinDate: '01/01/2024',
  stats: {
    following: 42,
    completed: 15,
    chapters: 1234,
    comments: 89
  }
})

// Settings state
const settings = ref({
  emailNotifications: true,
  browserNotifications: false,
  defaultReadingMode: 'vertical',
  defaultImageQuality: 'high'
})

// Modal states
const editProfile = ref(false)
const changeEmail = ref(false)
const changePassword = ref(false)

// Form states
const editForm = ref({
  username: user.value.username,
  bio: ''
})

const emailForm = ref({
  newEmail: '',
  password: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Actions
const changeAvatar = () => {
  // TODO: Implement avatar upload
  console.log('Change avatar')
}

const saveProfile = () => {
  // TODO: Implement profile update
  console.log('Save profile', editForm.value)
  editProfile.value = false
}

const updateEmail = () => {
  // TODO: Implement email update
  console.log('Update email', emailForm.value)
  changeEmail.value = false
}

const updatePassword = () => {
  // TODO: Implement password update
  console.log('Update password', passwordForm.value)
  changePassword.value = false
}

const deleteAccount = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
    // TODO: Implement account deletion
    console.log('Delete account')
  }
}
</script> 