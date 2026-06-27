import { apiClient } from '../lib/api-client';
import type { ApiResponseType, Product, Category } from '@mfc-platform/types';

export class ProductService {
  async getAll(): Promise<ApiResponseType<Product[]>> {
    return apiClient.get<ApiResponseType<Product[]>>('/products');
  }

  async getBySlug(slug: string): Promise<ApiResponseType<Product>> {
    return apiClient.get<ApiResponseType<Product>>(`/products/${slug}`);
  }
}

export class CategoryService {
  async getAll(): Promise<ApiResponseType<Category[]>> {
    return apiClient.get<ApiResponseType<Category[]>>('/categories');
  }
}