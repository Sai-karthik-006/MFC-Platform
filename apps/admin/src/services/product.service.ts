import { apiClient } from '../lib/api-client';
import type { ApiResponseType, Product } from '@mfc-platform/types';

export interface ProductWithPrice {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnailImage: string | null;
  isVeg: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date;
  price: number;
  images?: string[];
  stock?: number;
}

export class ProductService {
  async getProducts(): Promise<ProductWithPrice[]> {
    const response = await apiClient.get<ApiResponseType<Product[]>>('/products');
    return response.data as ProductWithPrice[];
  }

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete<ApiResponseType<void>>(`/products/${id}`);
  }
}

export const productService = new ProductService();