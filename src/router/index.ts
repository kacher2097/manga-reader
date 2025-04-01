import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { AuthService } from '../services/auth.service'

const authService = AuthService.getInstance();

// Route cho chuyển hướng sau khi đăng nhập
function redirectAfterLogin(to: any) {
  const authService = AuthService.getInstance();
  const redirectPath = to.query.redirect
  const isAdmin = authService.isAdmin()
  
  if (redirectPath) {
    return redirectPath
  }
  
  if (isAdmin) {
    return '/admin'
  }
  
  return '/' // Chuyển hướng mặc định về trang chủ
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/HomePage.vue')
  },
  {
    path: '/manga/:id',
    name: 'MangaDetail',
    component: () => import('../pages/MangaDetailPage.vue')
  },
  {
    path: '/manga/:id/chapter/:chapter',
    name: 'ChapterDetail',
    component: () => import('../pages/ChapterPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { requiresGuest: true },
    // Thêm afterAuth hook để chuyển hướng sau khi đăng nhập
    beforeEnter: (to, from, next) => {
      if (AuthService.getInstance().isAuthenticated()) {
        next(redirectAfterLogin(to))
      } else {
        next()
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/RegisterPage.vue'),
    meta: { requiresGuest: true },
    // Thêm afterAuth hook để chuyển hướng sau khi đăng ký
    beforeEnter: (to, from, next) => {
      if (AuthService.getInstance().isAuthenticated()) {
        next(redirectAfterLogin(to))
      } else {
        next()
      }
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/ProfilePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../pages/NotificationsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/continue',
    name: 'Continue',
    component: () => import('../pages/ContinuePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../pages/HistoryPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../pages/CategoriesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../pages/SearchPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/latest',
    name: 'Latest',
    component: () => import('../pages/LatestPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'Favorite',
    component: () => import('../pages/FavoritesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/following',
    name: 'Follow',
    component: () => import('../pages/FollowingPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/popular',
    name: 'Popular',
    component: () => import('../pages/PopularPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../pages/SettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('../pages/PrivacyPage.vue')
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('../pages/TermsPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFoundPage.vue')
  },
  // Admin routes
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../modules/admin/pages/DashboardPage.vue')
      },
      {
        path: 'manga',
        name: 'admin-manga',
        component: () => import('../modules/admin/pages/MangaListPage.vue')
      },
      {
        path: 'manga/:id/chapters',
        name: 'admin-chapters',
        component: () => import('../modules/admin/pages/ChapterListPage.vue')
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('../modules/admin/pages/CategoriesPage.vue')
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../modules/admin/pages/UsersPage.vue')
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('../modules/admin/pages/SettingsPage.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// // Thêm hook sau khi đăng nhập
// export async function handlePostLogin(router: any) {
//   try {
//     // Lấy thông tin người dùng hiện tại
//     const user = await authService.getCurrentUser;
    
//     // Nếu là admin, chuyển hướng đến trang admin
//     if (user?.role === 'ADMIN') {
//       router.push('/admin')
//     } else {
//       router.push('/')
//     }
//   } catch (error) {
//     console.error('Lỗi xử lý sau đăng nhập:', error)
//     // Trong trường hợp lỗi, chuyển hướng đến trang chủ
//     router.push('/')
//   }
// }

router.beforeEach(async (to, from, next) => {
  // Đảm bảo chúng ta có một instance đã khởi tạo
  const authInstance = AuthService.getInstance();
  
  // Cố gắng khởi tạo dữ liệu từ localStorage nếu chưa được xác thực
  try {
    if (!authInstance.isAuthenticated()) {
      await authInstance.initializeFromStorage();
    }

    // Sử dụng phương thức, không phải thuộc tính
    const isAuthenticated = authInstance.isAuthenticated();
    const isAdmin = authInstance.isAdmin();

    // Nếu user đã đăng nhập và là admin, và đang cố truy cập trang home hoặc login
    if (isAuthenticated && isAdmin && (to.path === '/' || to.path === '/login' || to.path === '/register')) {
      return next('/admin');
    }

    // Kiểm tra quyền truy cập route
    if (to.meta.requiresAuth && !isAuthenticated) {
      return next({ name: 'Login', query: { redirect: to.fullPath } });
    } else if (to.meta.requiresAdmin && !isAdmin) {
      return next('/');
    } else if (to.meta.requiresGuest && isAuthenticated) {
      return next(isAdmin ? '/admin' : '/');
    }

    return next();
  } catch (error) {
    console.error('Error in router guard:', error);
    // Nếu có lỗi, cho phép tiếp tục
    return next();
  }
});

// function proceed(to: any, next: any): void {
//   const isAuthenticated: boolean = store.getters.isAuthenticated;
//   const isAdmin: boolean = store.getters.isAdmin;

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login');
//   } else if (to.meta.requiresAdmin && !isAdmin) {
//     next('/user');
//   } else {
//     next();
//   }
// }

export default router