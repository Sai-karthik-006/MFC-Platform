export type UserRole = 'CUSTOMER' | 'ADMIN' | 'DELIVERY';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  createdAt: Date;
}