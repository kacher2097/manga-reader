<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <router-link to="/" class="text-3xl font-anime text-primary">
          MangaHub
        </router-link>
        <h2 class="mt-6 text-2xl font-bold">Tạo tài khoản mới</h2>
        <p class="mt-2 text-gray-400">
          Hoặc
          <router-link to="/login" class="text-primary hover:underline">
            đăng nhập nếu đã có tài khoản
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- Alert -->
        <div 
          v-if="error"
          class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg"
        >
          {{ error }}
        </div>

        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium mb-2">
            Tên người dùng
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="input"
            :disabled="loading"
          >
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
          <p class="mt-2 text-sm text-gray-400">
            Mật khẩu phải có ít nhất 8 ký tự
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium mb-2">
            Xác nhận mật khẩu
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="input pr-12"
              :disabled="loading"
            >
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i 
                :class="showConfirmPassword ? 'i-heroicons-eye-slash-20-solid' : 'i-heroicons-eye-20-solid'"
              />
            </button>
          </div>
        </div>

        <!-- Terms -->
        <div>
          <label class="flex items-start gap-2 cursor-pointer">
            <input 
              type="checkbox"
              v-model="agreeToTerms"
              class="accent-primary mt-1"
              required
              :disabled="loading"
            >
            <span class="text-sm">
              Tôi đồng ý với
              <router-link to="/terms" class="text-primary hover:underline">
                Điều khoản sử dụng
              </router-link>
              và
              <router-link to="/privacy" class="text-primary hover:underline">
                Chính sách bảo mật
              </router-link>
            </span>
          </label>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="loading || !isFormValid"
        >
          <template v-if="loading">
            <i class="i-heroicons-arrow-path-20-solid animate-spin" />
            <span class="ml-2">Đang đăng ký...</span>
          </template>
          <span v-else>Đăng ký</span>
        </button>

        <!-- Social Register -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-background text-gray-400">
              Hoặc đăng ký với
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeToTerms = ref(false)
const loading = ref(false)
const error = ref('')

// Computed
const isFormValid = computed(() => {
  return (
    username.value.trim() &&
    email.value.trim() &&
    password.value.length >= 8 &&
    password.value === confirmPassword.value &&
    agreeToTerms.value
  )
})

// Methods
const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''

    // Validate form
    if (!isFormValid.value) {
      throw new Error('Vui lòng điền đầy đủ thông tin')
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock register success
    router.push('/login')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Có lỗi xảy ra'
  } finally {
    loading.value = false
  }
}
</script> 