import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

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
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/RegisterPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/ProfilePage.vue')
  },
  // {
  //   path: '/bookmarks',
  //   name: 'Bookmarks',
  //   component: () => import('../pages/BookmarksPage.vue')
  // },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../pages/NotificationsPage.vue')
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
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router