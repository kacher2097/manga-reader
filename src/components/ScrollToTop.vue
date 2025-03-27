<template>
  <button
    v-show="showScrollTop"
    @click="scrollToTop"
    class="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40 transition-all duration-300"
  >
    <i class="fas fa-arrow-up"></i>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showScrollTop = ref(false)

const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const checkScroll = (): void => {
  showScrollTop.value = window.scrollY > 500
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script> 