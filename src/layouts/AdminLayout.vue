<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-64 bg-gray-800 h-screen fixed">
        <div class="p-4">
          <h1 class="text-xl font-bold text-primary">Manga Reader Admin</h1>
        </div>
        <div class="mt-4">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path"
            class="block px-4 py-2 hover:bg-gray-700 transition-colors"
            :class="{ 'bg-gray-700': isActive(item.path) }"
          >
            <i :class="[item.icon, 'mr-2']"></i>
            {{ item.title }}
          </router-link>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="ml-64 w-full">
        <div class="p-6">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { path: '/admin', title: 'Bảng điều khiển', icon: 'fas fa-tachometer-alt' },
  { path: '/admin/manga', title: 'Quản lý Manga', icon: 'fas fa-book' },
  { path: '/admin/manga/:id/chapters', title: 'Quản lý Chapter', icon: 'fas fa-list-ol' }
]

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path.split('/:')[0])
}
</script>

<style scoped>
.text-primary {
  color: #FF6B6B;
}
</style> 