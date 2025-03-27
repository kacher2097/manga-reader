<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <router-link to="/" class="flex items-center justify-center mb-6">
          <span class="text-3xl font-bold text-red-500">Manga<span class="text-white">Hub</span></span>
        </router-link>
        <h2 class="text-3xl font-bold text-white">
          Đăng nhập vào tài khoản
        </h2>
        <p class="mt-2 text-sm text-gray-400">
          Hoặc
          <router-link to="/register" class="font-medium text-red-500 hover:text-red-400">
            đăng ký tài khoản mới
          </router-link>
        </p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              :class="[
                'appearance-none rounded-lg relative block w-full px-4 py-3 border',
                'bg-gray-800 text-white placeholder-gray-400',
                'border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
                {'border-red-500': errors.email}
              ]"
              placeholder="Email"
            />
            <p v-if="errors.email" class="mt-2 text-sm text-red-500">{{ errors.email }}</p>
          </div>
          <div>
            <label for="password" class="sr-only">Mật khẩu</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              :class="[
                'appearance-none rounded-lg relative block w-full px-4 py-3 border',
                'bg-gray-800 text-white placeholder-gray-400',
                'border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
                {'border-red-500': errors.password}
              ]"
              placeholder="Mật khẩu"
            />
            <p v-if="errors.password" class="mt-2 text-sm text-red-500">{{ errors.password }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-700 rounded bg-gray-800"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-400">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-red-500 hover:text-red-400">
              Quên mật khẩu?
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-sign-in-alt"></i>
            </span>
            <span v-if="!loading">Đăng nhập</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </span>
          </button>
        </div>

        <!-- Social Login -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-900 text-gray-400">Hoặc đăng nhập với</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="w-full inline-flex justify-center py-3 px-4 rounded-lg border border-gray-700 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700"
            >
              <i class="fab fa-google text-red-500 mr-2"></i>
              Google
            </button>
            <button
              type="button"
              class="w-full inline-flex justify-center py-3 px-4 rounded-lg border border-gray-700 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700"
            >
              <i class="fab fa-facebook text-blue-500 mr-2"></i>
              Facebook
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const errors = ref({
  email: '',
  password: ''
})

// Form validation
const validateForm = () => {
  let isValid = true
  errors.value = {
    email: '',
    password: ''
  }

  if (!email.value) {
    errors.value.email = 'Email không được để trống'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Email không hợp lệ'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = 'Mật khẩu không được để trống'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  }

  return isValid
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful login
    router.push('/')
  } catch (error) {
    console.error('Login error:', error)
    // Handle error
  } finally {
    loading.value = false
  }
}
</script> 