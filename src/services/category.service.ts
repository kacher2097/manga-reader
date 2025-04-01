import axios from 'axios'
import { API_URL } from '@/config'

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  mangaCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class CategoryServiceClass {
  private readonly baseUrl = `${API_URL}/categories`;
  
  /**
   * Lấy danh sách tất cả thể loại
   */
  async getAll(): Promise<Category[]> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        return this.getMockCategories();
      }
      
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return this.getMockCategories();
    }
  }
  
  /**
   * Lấy thông tin thể loại theo ID
   */
  async getById(id: string | number): Promise<Category | null> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        const categories = this.getMockCategories();
        return categories.find(c => c.id.toString() === id.toString()) || null;
      }
      
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Lấy danh sách manga thuộc thể loại
   */
  async getMangaByCategory(categoryId: string | number, page = 1, limit = 20): Promise<any[]> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        return [];
      }
      
      const response = await axios.get(`${this.baseUrl}/${categoryId}/manga`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching manga for category ${categoryId}:`, error);
      return [];
    }
  }
  
  /**
   * Tạo thể loại mới
   */
  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category | null> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        const mockCategories = this.getMockCategories();
        const newCategory = {
          ...category,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return newCategory;
      }
      
      const response = await axios.post(this.baseUrl, category);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }
  
  /**
   * Cập nhật thể loại
   */
  async update(id: string | number, category: Partial<Category>): Promise<Category | null> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        return {
          ...category,
          id,
          updatedAt: new Date()
        } as Category;
      }
      
      const response = await axios.put(`${this.baseUrl}/${id}`, category);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Xóa thể loại
   */
  async delete(id: string | number): Promise<boolean> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      
      await axios.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Trả về dữ liệu thể loại mẫu cho phát triển
   */
  private getMockCategories(): Category[] {
    return [
      {
        id: '1',
        name: 'Action',
        slug: 'action',
        description: 'Manga với những pha hành động mãnh liệt',
        mangaCount: 342,
        createdAt: new Date(2022, 0, 1),
        updatedAt: new Date(2022, 5, 15)
      },
      {
        id: '2',
        name: 'Romance',
        slug: 'romance',
        description: 'Manga về tình yêu lãng mạn',
        mangaCount: 258,
        createdAt: new Date(2022, 0, 5),
        updatedAt: new Date(2022, 4, 20)
      },
      {
        id: '3',
        name: 'Fantasy',
        slug: 'fantasy',
        description: 'Manga về thế giới giả tưởng',
        mangaCount: 194,
        createdAt: new Date(2022, 1, 10),
        updatedAt: new Date(2022, 3, 25)
      },
      {
        id: '4',
        name: 'Comedy',
        slug: 'comedy',
        description: 'Manga hài hước vui nhộn',
        mangaCount: 163,
        createdAt: new Date(2022, 2, 15),
        updatedAt: new Date(2022, 6, 10)
      },
      {
        id: '5',
        name: 'Drama',
        slug: 'drama',
        description: 'Manga về các câu chuyện cảm động',
        mangaCount: 124,
        createdAt: new Date(2022, 3, 20),
        updatedAt: new Date(2022, 7, 5)
      },
      {
        id: '6',
        name: 'Horror',
        slug: 'horror',
        description: 'Manga về nội dung kinh dị',
        mangaCount: 96,
        createdAt: new Date(2022, 3, 25),
        updatedAt: new Date(2022, 8, 1)
      },
      {
        id: '7',
        name: 'Seinen',
        slug: 'seinen',
        description: 'Manga dành cho nam giới trưởng thành',
        mangaCount: 112,
        createdAt: new Date(2022, 4, 5),
        updatedAt: new Date(2022, 9, 10)
      },
      {
        id: '8',
        name: 'Shoujo',
        slug: 'shoujo',
        description: 'Manga dành cho nữ giới trẻ',
        mangaCount: 87,
        createdAt: new Date(2022, 5, 10),
        updatedAt: new Date(2022, 10, 15)
      }
    ];
  }
}

export const CategoryService = new CategoryServiceClass(); 