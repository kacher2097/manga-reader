import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import './assets/styles/index.css'

const app = createApp(App)
app.use(router)

router.beforeEach((to, from, next) => {
  const isAuthenticated = false; // logic để kiểm tra xem người dùng đã đăng nhập hay chưa
  if (typeof to.name === 'string' && to.name.includes('admin') && !isAuthenticated) {
    next({ name: 'Login' }); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
  } else {
    next();
  }
});

app.mount('#app')
