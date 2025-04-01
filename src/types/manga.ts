export interface Manga {
  id: string | number
  title: string
  slug: string
  alternativeTitles?: string
  description?: string
  coverImage: string
  categories: Category[]
  status: 'ONGOING' | 'COMPLETED' | 'DROPPED'
  author?: string
  artist?: string
  releaseYear?: string
  totalChapters?: number
  latestChapter?: number
  views?: number
  rating?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  id: string | number
  name: string
  slug?: string
  description?: string
  count?: number
}

export interface Chapter {
  id: string | number
  mangaId: string | number
  number: number
  title: string
  views: number
  pages: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: number
  message: string
  time: string
} 