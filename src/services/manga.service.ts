import axios from "axios";
import type { Manga } from "@/types/manga";
import { API_URL } from '@/config'

export interface Chapter {
  id: string | number;
  mangaId: string | number;
  number: number;
  title: string;
  views: number;
  pages: string[];
  createdAt: Date;
  updatedAt: Date;
}

class MangaServiceClass {
  private readonly baseUrl = `${API_URL}/manga`;
  
  /**
   * Lấy danh sách tất cả manga
   */
  async getAll(params = {}): Promise<Manga[]> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        return this.getMockMangas();
      }
      
      const response = await axios.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all manga:', error);
      return this.getMockMangas();
    }
  }
  
  /**
   * Lấy thông tin manga theo ID
   */
  async getById(id: string | number): Promise<Manga | null> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        const mangas = this.getMockMangas();
        return mangas.find(m => m.id.toString() === id.toString()) || null;
      }
      
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching manga with ID ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Tạo manga mới
   */
  async create(manga: Omit<Manga, 'id' | 'createdAt' | 'updatedAt'>): Promise<Manga | null> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        const newManga = {
          ...manga,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return newManga as Manga;
      }
      
      const response = await axios.post(this.baseUrl, manga);
      return response.data;
    } catch (error) {
      console.error('Error creating manga:', error);
      return null;
    }
  }
  
  /**
   * Cập nhật manga
   */
  async update(id: string | number, manga: Partial<Manga>): Promise<Manga | null> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        return {
          ...manga,
          id,
          updatedAt: new Date()
        } as Manga;
      }
      
      const response = await axios.put(`${this.baseUrl}/${id}`, manga);
      return response.data;
    } catch (error) {
      console.error(`Error updating manga ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Xóa manga
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
      console.error(`Error deleting manga ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Lấy danh sách chapter của manga
   */
  async getChapters(mangaId: string | number): Promise<Chapter[]> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        return this.getMockChapters(mangaId);
      }
      
      const response = await axios.get(`${this.baseUrl}/${mangaId}/chapters`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chapters for manga ${mangaId}:`, error);
      return [];
    }
  }
  
  /**
   * Lấy thông tin chapter
   */
  async getChapter(mangaId: string | number, chapterNumber: number): Promise<Chapter | null> {
    try {
      // Mô phỏng dữ liệu cho phát triển
      if (process.env.NODE_ENV === 'development') {
        const chapters = this.getMockChapters(mangaId);
        return chapters.find(c => c.number === chapterNumber) || null;
      }
      
      const response = await axios.get(`${this.baseUrl}/${mangaId}/chapters/${chapterNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chapter ${chapterNumber} for manga ${mangaId}:`, error);
      return null;
    }
  }
  
  /**
   * Trả về dữ liệu manga mẫu cho phát triển
   */
  private getMockMangas(): Manga[] {
    return [
      {
        id: '1',
        title: 'Solo Leveling',
        slug: 'solo-leveling',
        alternativeTitles: 'I Level Up Alone, Na Honjaman Lebeleop',
        description: 'Mười năm trước, sau khi "Cổng" kết nối thế giới thực với thế giới quái vật mở ra, một số người bình thường đã nhận được sức mạnh để săn quái vật bên trong "Cổng". Họ được biết đến là "Thợ săn". Tuy nhiên, không phải tất cả Thợ săn đều mạnh mẽ. Bệnh tật của mẹ khiến Sung Jinwoo phải kiếm tiền bằng cách nhận những nhiệm vụ nguy hiểm với mức lương thấp, để rồi bị chỉ trích, bị gọi là "thợ săn yếu nhất thế giới". Thậm chí, gã còn gần như chẳng sinh tồn được ngay cả từ những trận đấu cấp thấp... Cho đến một ngày, gã thức dậy sau một trận đấu "sắp chết" với một chương trình săn bắn chỉ gã mới thấy, và cùng với đó là một chuỗi nhiệm vụ nguy hiểm nhưng hấp dẫn. Gã sẽ hoàn thành tất cả nhiệm vụ của mình, cho tới khi trở thành người thợ săn mạnh nhất.',
        coverImage: 'https://m.media-amazon.com/images/I/81aiRRwGlaL._AC_UF1000,1000_QL80_.jpg',
        categories: [
          { id: '1', name: 'Action' },
          { id: '3', name: 'Fantasy' },
          { id: '7', name: 'Seinen' }
        ],
        status: 'COMPLETED',
        author: 'Chugong',
        artist: 'DUBU',
        releaseYear: '2018',
        totalChapters: 179,
        views: 1254863,
        rating: 4.8,
        createdAt: new Date(2022, 0, 1),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      },
      {
        id: '2',
        title: 'Jujutsu Kaisen',
        slug: 'jujutsu-kaisen',
        alternativeTitles: 'Sorcery Fight',
        description: 'Yuuji là một thiên tài tại đường chạy. Nhưng cậu không có hứng thú để chạy vòng tròn, cậu vui vẻ khi đến câu lạc bộ huyền bí học. Mặc dù cậu tự tìm hiểu về thế giới siêu nhiên, nhưng cậu thoáng buồn vì không có thật. Cho đến một ngày... cậu cứu được một thành viên từ câu lạc bộ huyền bí học, người mang một "vật thể bị nguyền rủa" - một vật chứa đựng phần linh hồn khát máu. Cuối cùng cậu ấy nuốt vật thể nguyền rủa và chia sẻ cơ thể của mình với nó để cứu bạn bè trong câu lạc bộ. Yuggin Yuuji trở thành vật chứa chính của một thực thể ác ma, giờ cậu ta được đưa vào một trường học của các phù thủy, nơi học về cách chiến đấu và điều khiển thứ sức mạnh ma quỷ. Cậu phải học cách sử dụng sức mạnh mới của mình nhanh đến mức có thể, bởi vì một tổ chức đáng sợ những quái vật bị nguyền rủa đang mưu đồ.',
        coverImage: 'https://cdn.myanimelist.net/images/manga/3/211807.jpg',
        categories: [
          { id: '1', name: 'Action' },
          { id: '3', name: 'Fantasy' },
          { id: '6', name: 'Horror' }
        ],
        status: 'ONGOING',
        author: 'Gege Akutami',
        artist: 'Gege Akutami',
        releaseYear: '2018',
        totalChapters: 245,
        views: 958742,
        rating: 4.7,
        createdAt: new Date(2022, 1, 15),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
      },
      {
        id: '3',
        title: 'One Piece',
        slug: 'one-piece',
        alternativeTitles: 'Đảo Hải Tặc',
        description: "Monkey D. Luffy từ chối tuân theo ý định của cha mình trở thành một hải tặc mạnh mẽ, người mà sau này tìm kiếm kho báu nổi tiếng chưa từng có One Piece của Vua Hải tặc Gold Roger. Trước khi chết, Gold Roger tiết lộ One Piece ở Grand Line, và từ đấy cuộc Đại Hải Trình bắt đầu. Đây là khởi đầu của cuộc hành trình của Luffy và những người bạn của mình để tìm kiếm One Piece và trở thành Vua Hải Tặc tiếp theo.",
        coverImage: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
        categories: [
          { id: '1', name: 'Action' },
          { id: '3', name: 'Fantasy' },
          { id: '4', name: 'Comedy' }
        ],
        status: 'ONGOING',
        author: 'Eiichiro Oda',
        artist: 'Eiichiro Oda',
        releaseYear: '1997',
        totalChapters: 1098,
        views: 2548963,
        rating: 4.9,
        createdAt: new Date(2022, 2, 20),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72)
      },
      {
        id: '4',
        title: 'Chainsaw Man',
        slug: 'chainsaw-man',
        alternativeTitles: 'チェンソーマン',
        description: 'Denji là một thiếu niên nghèo khổ đang cố trả số nợ khổng lồ mà cha cậu để lại bằng cách săn quỷ, với sự giúp đỡ của quỷ Chainsaw, Pochita. Đáng buồn thay, anh ta bị phản bội và bị sát hại bởi một con quỷ giao ước, nhưng Denji được hồi sinh khi trở thành lai quỷ: con "người chainsaw", hiện có khả năng biến đổi bất kỳ bộ phận cơ thể nào thành cưa xích!',
        coverImage: 'https://cdn.myanimelist.net/images/manga/3/216464.jpg',
        categories: [
          { id: '1', name: 'Action' },
          { id: '6', name: 'Horror' },
          { id: '7', name: 'Seinen' }
        ],
        status: 'ONGOING',
        author: 'Tatsuki Fujimoto',
        artist: 'Tatsuki Fujimoto',
        releaseYear: '2018',
        totalChapters: 145,
        views: 745896,
        rating: 4.6,
        createdAt: new Date(2022, 3, 10),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96)
      }
    ];
  }
  
  /**
   * Trả về dữ liệu chapter mẫu cho phát triển
   */
  private getMockChapters(mangaId: string | number): Chapter[] {
    const chapters: Chapter[] = [];
    const totalChapters = Math.floor(Math.random() * 20) + 5;
    
    for (let i = 1; i <= totalChapters; i++) {
      chapters.push({
        id: `${mangaId}-${i}`,
        mangaId: mangaId,
        number: i,
        title: `Chapter ${i}`,
        views: Math.floor(Math.random() * 10000) + 1000,
        pages: Array(Math.floor(Math.random() * 20) + 10).fill('').map((_, index) => 
          `https://placekitten.com/800/${500 + index}`
        ),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (totalChapters - i)),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (totalChapters - i))
      });
    }
    
    return chapters;
  }
}

export const MangaService = new MangaServiceClass(); 