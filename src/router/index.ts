import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../pages/HomePage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "auth" */ '../pages/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "auth" */ '../pages/RegisterPage.vue')
  },
  {
    path: '/manga/:id',
    name: 'MangaDetail',
    component: () => import(/* webpackChunkName: "manga" */ '../pages/MangaPage.vue')
  },
  {
    path: '/manga/:id/chapter/:chapter',
    name: 'ChapterDetail',
    component: () => import(/* webpackChunkName: "chapter" */ '../pages/ChapterPage.vue')
  },
  {
    path: '/reader/:mangaId/:chapterId',
    name: 'Reader',
    component: () => import(/* webpackChunkName: "reader" */ '../pages/ReaderPage.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../pages/SearchPage.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import(/* webpackChunkName: "categories" */ '../pages/CategoriesPage.vue')
  },
  {
    path: '/category/:id',
    name: 'CategoryDetail',
    component: () => import(/* webpackChunkName: "category" */ '../pages/CategoryPage.vue')
  },
  {
    path: '/latest',
    name: 'Latest',
    component: () => import(/* webpackChunkName: "latest" */ '../pages/LatestPage.vue')
  },
  {
    path: '/popular',
    name: 'Popular',
    component: () => import(/* webpackChunkName: "popular" */ '../pages/PopularPage.vue')
  },
  {
    path: '/continue',
    name: 'Continue',
    component: () => import(/* webpackChunkName: "continue" */ '../pages/ContinuePage.vue')
  },
  {
    path: '/following',
    name: 'Following',
    component: () => import(/* webpackChunkName: "following" */ '../pages/FollowingPage.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import(/* webpackChunkName: "history" */ '../pages/HistoryPage.vue')
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import(/* webpackChunkName: "favorites" */ '../pages/FavoritesPage.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../pages/ProfilePage.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '../pages/SettingsPage.vue')
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import(/* webpackChunkName: "notifications" */ '../pages/NotificationsPage.vue')
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../pages/AboutPage.vue')
  // },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import(/* webpackChunkName: "legal" */ '../pages/PrivacyPage.vue')
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import(/* webpackChunkName: "legal" */ '../pages/TermsPage.vue')
  },
  // {
  //   path: '/contact',
  //   name: 'Contact',
  //   component: () => import(/* webpackChunkName: "contact" */ '../pages/ContactPage.vue')
  // },
  // {
  //   path: '/dmca',
  //   name: 'DMCA',
  //   component: () => import(/* webpackChunkName: "legal" */ '../pages/DmcaPage.vue')
  // },
  // {
  //   path: '/completed',
  //   name: 'Completed',
  //   component: () => import(/* webpackChunkName: "completed" */ '../pages/CompletedPage.vue')
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "error" */ '../pages/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
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