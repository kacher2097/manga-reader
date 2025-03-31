import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Manga {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    status: 'ongoing' | 'completed' | 'dropped';
    categories: string[];
    latestChapter: number;
    rating: number;
    views: number;
    author: string;
    artist: string;
    releaseYear: string;
    createdAt: number;
    updatedAt: number;
}

export interface Chapter {
    id: string;
    mangaId: string;
    number: number;
    title: string;
    pages: string[];
    createdAt: number;
    updatedAt: number;
}

// Sample data for fallback
const sampleMangas: Manga[] = [
    {
        id: '1',
        title: 'One Piece',
        description: 'Theo chân cuộc phiêu lưu của Monkey D. Luffy...',
        coverImage: '/manga/one-piece.jpg',
        status: 'ongoing',
        categories: ['Action', 'Adventure', 'Comedy'],
        latestChapter: 1089,
        rating: 4.9,
        views: 1000000,
        author: 'Eiichiro Oda',
        artist: 'Eiichiro Oda',
        releaseYear: '1997',
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    // Thêm các manga mẫu khác nếu cần
];

// Fallback data khi API lỗi
const fallbackMangas: Manga[] = [
  {
    id: 'one-piece',
    title: 'One Piece',
    description: 'Theo chân cuộc phiêu lưu của Monkey D. Luffy...',
    coverImage: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    status: 'ongoing',
    categories: ['Action', 'Adventure'],
    latestChapter: 1089,
    views: 15000000,
    rating: 4.9,
    author: 'Eiichiro Oda',
    artist: 'Eiichiro Oda',
    releaseYear: '1997',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
]

const fallbackChapters: Chapter[] = [
  {
    id: 'one-piece-1089',
    mangaId: 'one-piece',
    number: 1089,
    title: 'Chapter 1089',
    pages: [
      'https://picsum.photos/800/1200?random=1',
      'https://picsum.photos/800/1200?random=2',
      'https://picsum.photos/800/1200?random=3'
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'one-piece-1088',
    mangaId: 'one-piece',
    number: 1088,
    title: 'Chapter 1088',
    pages: [
      'https://picsum.photos/800/1200?random=4',
      'https://picsum.photos/800/1200?random=5',
      'https://picsum.photos/800/1200?random=6'
    ],
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now() - 86400000
  },
  {
    id: 'one-piece-1087',
    mangaId: 'one-piece',
    number: 1087,
    title: 'Chapter 1087',
    pages: [
      'https://picsum.photos/800/1200?random=7',
      'https://picsum.photos/800/1200?random=8',
      'https://picsum.photos/800/1200?random=9'
    ],
    createdAt: Date.now() - 172800000, // 2 days ago
    updatedAt: Date.now() - 172800000
  }
]

const api = {
    async getAllMangas(): Promise<Manga[]> {
        try {
            const response = await axios.get(`${API_URL}/manga`);
            return response.data;
        } catch (error) {
            console.error('Error fetching mangas:', error);
            return sampleMangas;
        }
    },

    async getLatestMangas(): Promise<Manga[]> {
        try {
            const response = await axios.get(`${API_URL}/manga/latest`);
            return response.data;
        } catch (error) {
            console.error('Error fetching latest mangas:', error);
            return sampleMangas.sort((a, b) => b.updatedAt - a.updatedAt);
        }
    },

    async getPopularMangas(): Promise<Manga[]> {
        try {
            const response = await axios.get(`${API_URL}/manga/popular`);
            return response.data;
        } catch (error) {
            console.error('Error fetching popular mangas:', error);
            return sampleMangas.sort((a, b) => b.views - a.views);
        }
    },

    async getMangasByCategory(category: string): Promise<Manga[]> {
        try {
            const response = await axios.get(`${API_URL}/manga/category/${category}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching mangas by category:', error);
            return sampleMangas.filter(m => m.categories.includes(category));
        }
    },

    async searchMangas(query: string): Promise<Manga[]> {
        try {
            const response = await axios.get(`${API_URL}/manga/search`, {
                params: { query }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching mangas:', error);
            return sampleMangas.filter(m => 
                m.title.toLowerCase().includes(query.toLowerCase())
            );
        }
    },

    async getMangaById(id: string): Promise<Manga | null> {
        try {
            const response = await axios.get(`${API_URL}/manga/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching manga details:', error);
            return sampleMangas.find(m => m.id === id) || null;
        }
    },

    async getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
        try {
            const response = await axios.get(`${API_URL}/manga/${mangaId}/chapters`);
            return response.data;
        } catch (error) {
            console.error('Error fetching chapters:', error);
            return [];
        }
    },

    async getChapter(mangaId: string, number: number): Promise<Chapter> {
        try {
            const response = await axios.get(`${API_URL}/manga/${mangaId}/chapters/${number}`);
            return response.data;
        } catch (err) {
            console.error('Error fetching chapter:', err);
            const chapter = fallbackChapters.find(c => c.mangaId === mangaId && c.number === number);
            if (!chapter) throw new Error('Chapter not found');
            return chapter;
        }
    },

    // Manga Management APIs
    async createManga(manga: Omit<Manga, 'createdAt' | 'updatedAt'>): Promise<Manga> {
        try {
            const response = await axios.post(`${API_URL}/manga`, manga);
            return response.data;
        } catch (error) {
            console.error('Error creating manga:', error);
            throw error;
        }
    },

    async updateManga(manga: Partial<Manga> & { id: string }): Promise<Manga> {
        try {
            const response = await axios.put(`${API_URL}/manga/${manga.id}`, manga);
            return response.data;
        } catch (error) {
            console.error('Error updating manga:', error);
            throw error;
        }
    },

    async deleteManga(id: string): Promise<void> {
        try {
            await axios.delete(`${API_URL}/manga/${id}`);
        } catch (error) {
            console.error('Error deleting manga:', error);
            throw error;
        }
    },

    // Chapter Management APIs
    async createChapter(mangaId: string, chapter: Omit<Chapter, 'id' | 'mangaId' | 'createdAt' | 'updatedAt'>): Promise<Chapter> {
        try {
            const response = await axios.post(`${API_URL}/manga/${mangaId}/chapters`, chapter);
            return response.data;
        } catch (error) {
            console.error('Error creating chapter:', error);
            throw error;
        }
    },

    async updateChapter(mangaId: string, chapterNumber: number, chapter: Partial<Omit<Chapter, 'id' | 'mangaId'>>): Promise<Chapter> {
        try {
            const response = await axios.put(`${API_URL}/manga/${mangaId}/chapters/${chapterNumber}`, chapter);
            return response.data;
        } catch (error) {
            console.error('Error updating chapter:', error);
            throw error;
        }
    },

    async deleteChapter(mangaId: string, chapterNumber: number): Promise<void> {
        try {
            await axios.delete(`${API_URL}/manga/${mangaId}/chapters/${chapterNumber}`);
        } catch (error) {
            console.error('Error deleting chapter:', error);
            throw error;
        }
    }
};

export default api; 