/**
 * Định dạng ngày tháng thành chuỗi
 * @param date Đối tượng Date hoặc chuỗi thời gian
 * @param format Định dạng (mặc định: 'DD/MM/YYYY')
 * @returns Chuỗi ngày đã định dạng
 */
export const formatDate = (date: Date | string | number, format: string = 'DD/MM/YYYY'): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Ngày không hợp lệ';
  }
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'HH:mm DD/MM/YYYY':
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Định dạng số thành chuỗi có dấu phân cách
 * @param number Số cần định dạng
 * @param locale Định dạng locale (mặc định: 'vi-VN')
 * @returns Chuỗi số đã định dạng
 */
export const formatNumber = (number: number, locale: string = 'vi-VN'): string => {
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Định dạng thời gian "cách đây bao lâu"
 * @param date Đối tượng Date hoặc chuỗi thời gian
 * @returns Chuỗi đã định dạng (ví dụ: "5 phút trước")
 */
export const formatTimeAgo = (date: Date | string | number): string => {
  const d = new Date(date);
  const now = new Date();
  
  if (isNaN(d.getTime())) {
    return 'Thời gian không hợp lệ';
  }
  
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (seconds < 60) {
    return 'vừa xong';
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} phút trước`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} giờ trước`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ngày trước`;
  }
  
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} tháng trước`;
  }
  
  const years = Math.floor(months / 12);
  return `${years} năm trước`;
};

/**
 * Định dạng số lớn thành dạng rút gọn (K, M, B)
 * @param num Số cần định dạng
 * @returns Chuỗi đã định dạng (ví dụ: "1.2K", "3.5M")
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}; 