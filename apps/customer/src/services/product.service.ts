import { apiClient } from '../lib/api-client';
import type { ApiResponseType, Product } from '@mfc-platform/types';

export class ProductService {
  async getFeaturedProducts(): Promise<Product[]> {
    const response = await apiClient.get<ApiResponseType<Product[]>>('/api/v1/products');
    return response.data.filter(p => p.isFeatured).slice(0, 8);
  }

  async getBestSellers(): Promise<Product[]> {
    const response = await apiClient.get<ApiResponseType<Product[]>>('/api/v1/products');
    return response.data.filter(p => p.isAvailable).slice(0, 4);
  }
}

export const productService = new ProductService();
