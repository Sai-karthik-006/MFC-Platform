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