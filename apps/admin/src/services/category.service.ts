import { apiClient } from '../lib/api-client';
import type { ApiResponseType, Category } from '@mfc-platform/types';

export interface CategoryWithProductsCount {
  id: string;
  name: string;
  description: string | null;
  productsCount: number;
  status: "Active" | "Inactive";
}

export class CategoryService {
  async getCategories(): Promise<CategoryWithProductsCount[]> {
    const response = await apiClient.get<ApiResponseType<Category[]>>('/categories');
    return response.data.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      productsCount: 0,
      status: category.isActive ? "Active" : "Inactive",
    }));
  }

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete<ApiResponseType<void>>(`/categories/${id}`);
  }
}

export const categoryService = new CategoryService();