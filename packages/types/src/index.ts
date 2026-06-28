export type UserRole = 'CUSTOMER' | 'ADMIN' | 'DELIVERY';

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export type ApiResponseType<T = unknown> = {
  success: boolean;
  data: T;
  timestamp: string;
};

export type ApiErrorType = {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path?: string;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  bannerImage: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnailImage: string | null;
  isVeg: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  categoryId: string;
  category: CategorySummary;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationType = 'ORDER_CONFIRMED' | 'ORDER_PREPARING' | 'ORDER_PICKED_UP' | 'ORDER_DELIVERED' | 'NEW_CATERING_REQUEST' | 'NEW_ORDER_ASSIGNED';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: string | null;
  cateringId?: string | null;
  isRead: boolean;
  createdAt: string;
}