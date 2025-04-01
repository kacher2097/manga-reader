import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { AuthService } from '../services/auth.service'

// Route cho chuyển hướng sau khi đăng nhập
function redirectAfterLogin(to: any) {
  const redirectPath = to.query.redirect
  const isAdmin = AuthService.isAdmin()
  
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
      if (AuthService.isAuthenticated()) {
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
      if (AuthService.isAuthenticated()) {
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

// Thêm hook sau khi đăng nhập
export async function handlePostLogin(router: any) {
  try {
    // Lấy thông tin người dùng hiện tại
    const user = await AuthService.getCurrentUser()
    
    // Nếu là admin, chuyển hướng đến trang admin
    if (user?.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error('Lỗi xử lý sau đăng nhập:', error)
    // Trong trường hợp lỗi, chuyển hướng đến trang chủ
    router.push('/')
  }
}

export default router