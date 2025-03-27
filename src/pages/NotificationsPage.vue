<template>
  <div class="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">Thông báo</h1>
            <p class="text-gray-400">Cập nhật mới nhất về manga bạn theo dõi</p>
          </div>
          <button
            @click="markAllAsRead"
            class="text-red-500 hover:text-red-400"
          >
            <i class="fas fa-check-double mr-2"></i>
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-4 mb-8">
        <select
          v-model="filter.type"
          class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="all">Tất cả thông báo</option>
          <option value="chapter">Chapter mới</option>
          <option value="comment">Bình luận</option>
          <option value="system">Hệ thống</option>
        </select>
        <select
          v-model="filter.time"
          class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="all">Tất cả thời gian</option>
          <option value="today">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
        </select>
        <select
          v-model="filter.read"
          class="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="unread">Chưa đọc</option>
          <option value="read">Đã đọc</option>
        </select>
      </div>

      <!-- Notifications List -->
      <div class="space-y-4">
        <!-- Today -->
        <div v-if="todayNotifications.length > 0">
          <h2 class="text-xl font-semibold text-white mb-4">Hôm nay</h2>
          <div class="space-y-4">
            <div
              v-for="notification in todayNotifications"
              :key="notification.id"
              :class="[
                'bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors duration-200',
                { 'border-l-4 border-red-500': !notification.read }
              ]"
            >
              <div class="flex items-start p-4 gap-4">
                <!-- Icon -->
                <div
                  :class="[
                    'shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                    {
                      'bg-red-500': notification.type === 'chapter',
                      'bg-blue-500': notification.type === 'comment',
                      'bg-yellow-500': notification.type === 'system'
                    }
                  ]"
                >
                  <i
                    :class="[
                      'text-white text-lg',
                      {
                        'fas fa-book': notification.type === 'chapter',
                        'fas fa-comment': notification.type === 'comment',
                        'fas fa-bell': notification.type === 'system'
                      }
                    ]"
                  ></i>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="text-white">{{ notification.title }}</div>
                      <div class="mt-1 text-sm text-gray-400">
                        {{ notification.message }}
                      </div>
                      <div class="mt-2 flex items-center gap-4">
                        <router-link
                          :to="notification.link"
                          class="text-red-500 hover:text-red-400"
                        >
                          <i class="fas fa-external-link-alt mr-1"></i>
                          Xem chi tiết
                        </router-link>
                        <span class="text-sm text-gray-500">{{ notification.time }}</span>
                      </div>
                    </div>
                    <button
                      @click="markAsRead(notification.id)"
                      v-if="!notification.read"
                      class="shrink-0 text-gray-400 hover:text-white"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Yesterday -->
        <div v-if="yesterdayNotifications.length > 0">
          <h2 class="text-xl font-semibold text-white mb-4">Hôm qua</h2>
          <div class="space-y-4">
            <div
              v-for="notification in yesterdayNotifications"
              :key="notification.id"
              :class="[
                'bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors duration-200',
                { 'border-l-4 border-red-500': !notification.read }
              ]"
            >
              <div class="flex items-start p-4 gap-4">
                <!-- Icon -->
                <div
                  :class="[
                    'shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                    {
                      'bg-red-500': notification.type === 'chapter',
                      'bg-blue-500': notification.type === 'comment',
                      'bg-yellow-500': notification.type === 'system'
                    }
                  ]"
                >
                  <i
                    :class="[
                      'text-white text-lg',
                      {
                        'fas fa-book': notification.type === 'chapter',
                        'fas fa-comment': notification.type === 'comment',
                        'fas fa-bell': notification.type === 'system'
                      }
                    ]"
                  ></i>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="text-white">{{ notification.title }}</div>
                      <div class="mt-1 text-sm text-gray-400">
                        {{ notification.message }}
                      </div>
                      <div class="mt-2 flex items-center gap-4">
                        <router-link
                          :to="notification.link"
                          class="text-red-500 hover:text-red-400"
                        >
                          <i class="fas fa-external-link-alt mr-1"></i>
                          Xem chi tiết
                        </router-link>
                        <span class="text-sm text-gray-500">{{ notification.time }}</span>
                      </div>
                    </div>
                    <button
                      @click="markAsRead(notification.id)"
                      v-if="!notification.read"
                      class="shrink-0 text-gray-400 hover:text-white"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Older -->
        <div v-if="olderNotifications.length > 0">
          <h2 class="text-xl font-semibold text-white mb-4">Cũ hơn</h2>
          <div class="space-y-4">
            <div
              v-for="notification in olderNotifications"
              :key="notification.id"
              :class="[
                'bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors duration-200',
                { 'border-l-4 border-red-500': !notification.read }
              ]"
            >
              <div class="flex items-start p-4 gap-4">
                <!-- Icon -->
                <div
                  :class="[
                    'shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                    {
                      'bg-red-500': notification.type === 'chapter',
                      'bg-blue-500': notification.type === 'comment',
                      'bg-yellow-500': notification.type === 'system'
                    }
                  ]"
                >
                  <i
                    :class="[
                      'text-white text-lg',
                      {
                        'fas fa-book': notification.type === 'chapter',
                        'fas fa-comment': notification.type === 'comment',
                        'fas fa-bell': notification.type === 'system'
                      }
                    ]"
                  ></i>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="text-white">{{ notification.title }}</div>
                      <div class="mt-1 text-sm text-gray-400">
                        {{ notification.message }}
                      </div>
                      <div class="mt-2 flex items-center gap-4">
                        <router-link
                          :to="notification.link"
                          class="text-red-500 hover:text-red-400"
                        >
                          <i class="fas fa-external-link-alt mr-1"></i>
                          Xem chi tiết
                        </router-link>
                        <span class="text-sm text-gray-500">{{ notification.time }}</span>
                      </div>
                    </div>
                    <button
                      @click="markAsRead(notification.id)"
                      v-if="!notification.read"
                      class="shrink-0 text-gray-400 hover:text-white"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!loading && filteredNotifications.length === 0"
          class="text-center py-12"
        >
          <i class="fas fa-bell text-4xl text-gray-600 mb-4"></i>
          <h3 class="text-xl font-medium text-white mb-2">Không có thông báo</h3>
          <p class="text-gray-400">
            Bạn chưa có thông báo nào trong khoảng thời gian này
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="flex justify-center items-center py-8"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
      </div>

      <!-- Load More -->
      <div
        v-if="!loading && hasMore"
        class="flex justify-center mt-8"
      >
        <button
          @click="loadMore"
          class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Xem thêm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Filter state
const filter = ref({
  type: 'all',
  time: 'all',
  read: 'all'
})

// Mock data
const notifications = ref([
  {
    id: '1',
    type: 'chapter',
    title: 'One Piece Chapter 1089',
    message: 'Chapter mới đã được cập nhật',
    link: '/manga/one-piece/chapter/1089',
    time: '2 giờ trước',
    read: false
  },
  {
    id: '2',
    type: 'comment',
    title: 'Bình luận mới',
    message: 'User123 đã trả lời bình luận của bạn',
    link: '/manga/naruto/chapter/700#comment-123',
    time: '5 giờ trước',
    read: true
  },
  {
    id: '3',
    type: 'system',
    title: 'Chào mừng bạn!',
    message: 'Cảm ơn bạn đã tham gia cộng đồng manga của chúng tôi',
    link: '/profile',
    time: 'Hôm qua',
    read: false
  },
  {
    id: '4',
    type: 'chapter',
    title: 'Naruto Chapter 700',
    message: 'Chapter mới đã được cập nhật',
    link: '/manga/naruto/chapter/700',
    time: '2 ngày trước',
    read: true
  }
])

const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// Filter notifications
const filteredNotifications = computed(() => {
  return notifications.value.filter(notification => {
    if (filter.value.type !== 'all' && notification.type !== filter.value.type) {
      return false
    }
    if (filter.value.read !== 'all') {
      if (filter.value.read === 'read' && !notification.read) return false
      if (filter.value.read === 'unread' && notification.read) return false
    }
    return true
  })
})

// Group notifications by time
const todayNotifications = computed(() => {
  return filteredNotifications.value.filter(notification => notification.time.includes('giờ'))
})

const yesterdayNotifications = computed(() => {
  return filteredNotifications.value.filter(notification => notification.time === 'Hôm qua')
})

const olderNotifications = computed(() => {
  return filteredNotifications.value.filter(notification => !notification.time.includes('giờ') && notification.time !== 'Hôm qua')
})

// Mark notification as read
const markAsRead = (id: string) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

// Mark all as read
const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

// Load more notifications
const loadMore = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock new data
    const newNotifications = [
      {
        id: '5',
        type: 'chapter',
        title: 'Dragon Ball Chapter 519',
        message: 'Chapter mới đã được cập nhật',
        link: '/manga/dragon-ball/chapter/519',
        time: '3 ngày trước',
        read: true
      },
      {
        id: '6',
        type: 'comment',
        title: 'Bình luận mới',
        message: 'User456 đã thích bình luận của bạn',
        link: '/manga/bleach/chapter/686#comment-456',
        time: '4 ngày trước',
        read: false
      }
    ]
    
    notifications.value.push(...newNotifications)
    page.value++
    hasMore.value = page.value < 5
  } catch (error) {
    console.error('Error loading more notifications:', error)
  } finally {
    loading.value = false
  }
}
</script> 