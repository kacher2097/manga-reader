import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

type Manga = {
  id: string;
  title: string;
  coverImage: string;
  status: 'ongoing' | 'completed'; // Chỉ cho phép hai giá trị này
  latestChapter: number;
  rating: number;
  views: number;
  addedAt: string;
  lastRead: string;
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/manga/:id',
      name: 'manga',
      component: () => import('../pages/MangaPage.vue')
    },
    {
      path: '/manga/:id/chapter/:chapter',
      name: 'chapter',
      component: () => import('../pages/ChapterPage.vue')
    },
    {
      path: '/reader/:mangaId/:chapterId',
      name: 'reader',
      component: () => import('../pages/ReaderPage.vue')
    },
    {
      path: '/continue',
      name: 'continue',
      component: () => import('../pages/ContinuePage.vue')
    },
    {
      path: '/latest',
      name: 'latest',
      component: () => import('../pages/LatestPage.vue')
    },
    {
      path: '/popular',
      name: 'popular',
      component: () => import('../pages/PopularPage.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../pages/CategoriesPage.vue')
    },
    {
      path: '/category/:id',
      name: 'category',
      component: () => import('../pages/CategoryPage.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../pages/SearchPage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../pages/RegisterPage.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../pages/ProfilePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../pages/FavoritesPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/following',
      name: 'following',
      component: () => import('../pages/FollowingPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../pages/HistoryPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../pages/NotificationsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../pages/SettingsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../pages/TermsPage.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../pages/PrivacyPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFoundPage.vue'),
    },
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = false // Replace with your auth logic
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router 