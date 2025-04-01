import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import './assets/styles/index.css'
import { AuthService } from './services/auth.service'

const app = createApp(App)
app.use(router)

router.beforeEach((to, from, next) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const isAdmin = AuthService.isAdmin();
  
  // Nếu route yêu cầu xác thực
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }
  
  // Nếu route yêu cầu quyền admin
  if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'Home' });
    return;
  }
  
  // Nếu route yêu cầu khách (chưa đăng nhập)
  if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'Home' });
    return;
  }
  
  next();
});

app.mount('#app')
