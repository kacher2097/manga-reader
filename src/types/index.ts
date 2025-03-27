export interface Manga {
  id: string;
  title: string;
  coverImage: string;
  status: 'ongoing' | 'completed';
  latestChapter: number;
  rating: number;
  views: number;
  addedAt: string;
  lastRead: string;
} 