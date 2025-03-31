<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Quản lý người dùng</h1>
      <button
        @click="showAddModal = true"
        class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
      >
        <i class="fas fa-user-plus mr-2"></i>
        Thêm người dùng
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="flex flex-wrap gap-4">
      <div class="flex-1 relative min-w-[200px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm người dùng..."
          class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg pl-10"
        />
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
      <select
        v-model="roleFilter"
        class="bg-gray-700 text-white px-4 py-2 rounded-lg min-w-[150px]"
      >
        <option value="">Tất cả vai trò</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="user">User</option>
      </select>
      <select
        v-model="statusFilter"
        class="bg-gray-700 text-white px-4 py-2 rounded-lg min-w-[150px]"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="active">Đang hoạt động</option>
        <option value="inactive">Không hoạt động</option>
        <option value="banned">Đã khóa</option>
      </select>
      <select
        v-model="sortBy"
        class="bg-gray-700 text-white px-4 py-2 rounded-lg min-w-[150px]"
      >
        <option value="username">Tên A-Z</option>
        <option value="-username">Tên Z-A</option>
        <option value="createdAt">Ngày tạo (Cũ nhất)</option>
        <option value="-createdAt">Ngày tạo (Mới nhất)</option>
        <option value="lastLogin">Đăng nhập (Cũ nhất)</option>
        <option value="-lastLogin">Đăng nhập (Mới nhất)</option>
      </select>
    </div>

    <!-- Users Table -->
    <div class="bg-gray-800 rounded-lg overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-700">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Người dùng
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Vai trò
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Trạng thái
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Đăng nhập cuối
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="hover:bg-gray-700/50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-3">
                <img
                  :src="user.avatar"
                  :alt="user.username"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div class="text-white font-medium">{{ user.username }}</div>
                  <div class="text-gray-400 text-sm">ID: {{ user.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-400">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                  user.role === 'moderator' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                ]"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  user.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                ]"
              >
                {{ formatStatus(user.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-400">
              {{ formatTimeAgo(user.lastLogin) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editUser(user)"
                class="text-blue-400 hover:text-blue-300 transition-colors mr-3"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                v-if="user.status !== 'banned'"
                @click="banUser(user)"
                class="text-red-400 hover:text-red-300 transition-colors mr-3"
                title="Khóa tài khoản"
              >
                <i class="fas fa-ban"></i>
              </button>
              <button
                v-else
                @click="unbanUser(user)"
                class="text-green-400 hover:text-green-300 transition-colors mr-3"
                title="Mở khóa tài khoản"
              >
                <i class="fas fa-unlock"></i>
              </button>
              <button
                @click="resetPassword(user)"
                class="text-yellow-400 hover:text-yellow-300 transition-colors"
                title="Đặt lại mật khẩu"
              >
                <i class="fas fa-key"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-white mb-4">
          {{ showEditModal ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">
              Tên người dùng
            </label>
            <input
              v-model="form.username"
              type="text"
              required
              class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            />
          </div>
          <div>
            <label class="block text-gray-400 text-sm font-medium mb-2">
              Vai trò
            </label>
            <select
              v-model="form.role"
              required
              class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              {{ showEditModal ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-white mb-4">
          Đặt lại mật khẩu
        </h2>
        <p class="text-gray-400 mb-6">
          Bạn có chắc chắn muốn đặt lại mật khẩu cho người dùng "{{ selectedUser?.username }}"?
          Một email sẽ được gửi đến {{ selectedUser?.email }} với mật khẩu mới.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showResetModal = false"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Hủy
          </button>
          <button
            @click="confirmResetPassword"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface User {
  id: string
  username: string
  email: string
  avatar: string
  role: 'admin' | 'moderator' | 'user'
  status: 'active' | 'inactive' | 'banned'
  lastLogin: number
}

// Sample data
const users = ref<User[]>([
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',
    role: 'admin',
    status: 'active',
    lastLogin: Date.now() - 1000 * 60 * 30 // 30 minutes ago
  },
  {
    id: '2',
    username: 'moderator',
    email: 'mod@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Moderator&background=3b82f6&color=fff',
    role: 'moderator',
    status: 'active',
    lastLogin: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
  },
  {
    id: '3',
    username: 'user1',
    email: 'user1@example.com',
    avatar: 'https://ui-avatars.com/api/?name=User1&background=6b7280&color=fff',
    role: 'user',
    status: 'inactive',
    lastLogin: Date.now() - 1000 * 60 * 60 * 24 * 3 // 3 days ago
  },
  {
    id: '4',
    username: 'user2',
    email: 'user2@example.com',
    avatar: 'https://ui-avatars.com/api/?name=User2&background=6b7280&color=fff',
    role: 'user',
    status: 'banned',
    lastLogin: Date.now() - 1000 * 60 * 60 * 24 * 7 // 7 days ago
  }
])

const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const sortBy = ref('username')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showResetModal = ref(false)
const selectedUser = ref<User | null>(null)
const form = ref({
  username: '',
  email: '',
  role: 'user' as User['role']
})

const filteredUsers = computed(() => {
  let result = [...users.value]
  
  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }
  
  // Role filter
  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value)
  }
  
  // Status filter
  if (statusFilter.value) {
    result = result.filter(user => user.status === statusFilter.value)
  }
  
  // Sort
  const [field, order] = sortBy.value.startsWith('-') 
    ? [sortBy.value.slice(1), 'desc']
    : [sortBy.value, 'asc']
    
  result.sort((a, b) => {
    const aValue = a[field as keyof User]
    const bValue = b[field as keyof User]
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })
  
  return result
})

const formatStatus = (status: User['status']) => {
  switch (status) {
    case 'active':
      return 'Đang hoạt động'
    case 'inactive':
      return 'Không hoạt động'
    case 'banned':
      return 'Đã khóa'
  }
}

const formatTimeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) {
    return 'vừa xong'
  }
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} phút trước`
  }
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} giờ trước`
  }
  
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}

const editUser = (user: User) => {
  selectedUser.value = user
  form.value = {
    username: user.username,
    email: user.email,
    role: user.role
  }
  showEditModal.value = true
}

const banUser = (user: User) => {
  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) {
    users.value[index] = {
      ...user,
      status: 'banned'
    }
  }
}

const unbanUser = (user: User) => {
  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) {
    users.value[index] = {
      ...user,
      status: 'active'
    }
  }
}

const resetPassword = (user: User) => {
  selectedUser.value = user
  showResetModal.value = true
}

const confirmResetPassword = () => {
  // TODO: Implement password reset logic
  showResetModal.value = false
  selectedUser.value = null
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedUser.value = null
  form.value = {
    username: '',
    email: '',
    role: 'user'
  }
}

const handleSubmit = () => {
  if (showEditModal.value && selectedUser.value) {
    // Update user
    const index = users.value.findIndex(u => u.id === selectedUser.value?.id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        ...form.value
      }
    }
  } else {
    // Add new user
    users.value.push({
      id: Math.random().toString(36).substr(2, 9),
      ...form.value,
      avatar: `https://ui-avatars.com/api/?name=${form.value.username}&background=6b7280&color=fff`,
      status: 'active',
      lastLogin: Date.now()
    })
  }
  closeModal()
}
</script>

<style scoped>
.text-primary {
  color: #FF6B6B;
}

.bg-primary {
  background-color: #FF6B6B;
}

.hover\:bg-primary-dark:hover {
  background-color: #FF5252;
}
</style> 