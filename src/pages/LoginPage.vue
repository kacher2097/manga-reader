<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <router-link to="/" class="text-3xl font-anime text-primary">
          MangaHub
        </router-link>
        <h2 class="mt-6 text-2xl font-bold">Đăng nhập</h2>
        <p class="mt-2 text-gray-400">
          Hoặc
          <router-link to="/register" class="text-primary hover:underline">
            tạo tài khoản mới
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- Alert -->
        <div 
          v-if="error"
          class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg"
        >
          {{ error }}
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input"
            :disabled="loading"
          >
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium mb-2">
            Mật khẩu
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input pr-12"
              :disabled="loading"
            >
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              @click="showPassword = !showPassword"
            >
              <i 
                :class="showPassword ? 'i-heroicons-eye-slash-20-solid' : 'i-heroicons-eye-20-solid'"
              />
            </button>
          </div>
        </div>

        <!-- Remember & Forgot -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              v-model="rememberMe"
              class="accent-primary"
              :disabled="loading"
            >
            <span class="text-sm">Ghi nhớ đăng nhập</span>
          </label>
          <router-link 
            to="/forgot-password"
            class="text-sm text-primary hover:underline"
          >
            Quên mật khẩu?
          </router-link>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="loading"
        >
          <template v-if="loading">
            <i class="i-heroicons-arrow-path-20-solid animate-spin" />
            <span class="ml-2">Đang đăng nhập...</span>
          </template>
          <span v-else>Đăng nhập</span>
        </button>

        <!-- Social Login -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-background text-gray-400">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button
            type="button"
            class="btn bg-background-light hover:bg-background flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <i class="i-heroicons-google-20-solid" />
            Google
          </button>
          <button
            type="button"
            class="btn bg-background-light hover:bg-background flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <i class="i-heroicons-facebook-20-solid" />
            Facebook
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

// Methods
const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock login success
    router.push('/')
  } catch (err) {
    error.value = 'Email hoặc mật khẩu không đúng'
  } finally {
    loading.value = false
  }
}
</script> 