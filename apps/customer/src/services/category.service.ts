import { apiClient } from '../lib/api-client';
import type { ApiResponseType, Category } from '@mfc-platform/types';

export class CategoryService {
  async getCategories(): Promise<ApiResponseType<Category[]>> {
    return apiClient.get<ApiResponseType<Category[]>>('/api/v1/categories');
  }
}

export const categoryService = new CategoryService();