export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role: 'admin' | 'user';
  token: string;
} 