// API endpoints
export const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: {
    DASHBOARD: '/admin',
    MANGA: '/admin/manga',
    MANGA_CREATE: '/admin/manga/create',
    MANGA_EDIT: (id: string | number) => `/admin/manga/${id}/edit`,
    MANGA_CHAPTERS: (id: string | number) => `/admin/manga/${id}/chapters`,
    CATEGORIES: '/admin/categories',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings'
  },
  MANGA: {
    DETAILS: (slug: string) => `/manga/${slug}`,
    CHAPTER: (slug: string, chapterNum: string | number) => `/manga/${slug}/chapter/${chapterNum}`
  },
  CATEGORY: (slug: string) => `/category/${slug}`,
  SEARCH: '/search',
  PROFILE: '/profile',
  SETTINGS: '/settings'
};

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 20,
  MAX_VISIBLE_PAGES: 5
};

// Theme settings
export const THEME = {
  PRIMARY_COLOR: '#FF6B6B',
  SECONDARY_COLOR: '#4ECDC4',
  DARK_MODE: true
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'manga-hub-auth-token',
  USER_DATA: 'manga-hub-user',
  THEME_SETTING: 'manga-hub-theme',
  READING_HISTORY: 'manga-hub-reading-history',
  BOOKMARKS: 'manga-hub-bookmarks'
};

// App settings
export const APP_SETTINGS = {
  APP_NAME: 'MangaHub',
  APP_VERSION: '1.0.0',
  COPYRIGHT_YEAR: new Date().getFullYear(),
  SUPPORT_EMAIL: 'support@mangahub.com'
};

// Social links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/mangahub',
  TWITTER: 'https://twitter.com/mangahub',
  INSTAGRAM: 'https://instagram.com/mangahub',
  DISCORD: 'https://discord.gg/mangahub'
};

// File upload settings
export const UPLOAD_SETTINGS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_CHAPTER_IMAGES: 200
}; 