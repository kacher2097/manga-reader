<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 class="text-3xl font-bold mb-4">Không tìm thấy trang</h2>
      <p class="text-gray-400 mb-8">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển
      </p>
      <div class="flex items-center justify-center gap-4">
        <button 
          class="btn bg-background-light hover:bg-background"
          @click="$router.go(-1)"
        >
          <i class="i-heroicons-arrow-left-20-solid" />
          <span class="ml-2">Quay lại</span>
        </button>
        <router-link to="/" class="btn btn-primary">
          <i class="i-heroicons-home-20-solid" />
          <span class="ml-2">Trang chủ</span>
        </router-link>
      </div>
    </div>
  </div>
</template> 