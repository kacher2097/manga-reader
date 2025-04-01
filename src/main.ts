import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import './assets/styles/index.css'
import { AuthService } from './services/auth.service'

const app = createApp(App)
app.use(router)

// Lưu ý: Chúng tôi không khai báo router.beforeEach ở đây nữa vì đã được khai báo trong router/index.ts
// Việc khai báo guard ở hai nơi có thể gây xung đột và gây ra lỗi

app.mount('#app')
