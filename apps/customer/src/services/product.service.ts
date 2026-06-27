import { apiClient } from '../lib/api-client';
import type { ApiResponseType, Product } from '@mfc-platform/types';

export interface ProductWithPrice extends Product {
  price: number;
}

export class ProductService {
  async getFeaturedProducts(): Promise<ProductWithPrice[]> {
    const response = await apiClient.get<ApiResponseType<Product[]>>('/api/v1/products');
    return response.data.filter(p => p.isFeatured).slice(0, 8) as ProductWithPrice[];
  }

  async getBestSellers(): Promise<ProductWithPrice[]> {
    const response = await apiClient.get<ApiResponseType<Product[]>>('/api/v1/products');
    return response.data.filter(p => p.isAvailable).slice(0, 4) as ProductWithPrice[];
  }

  async getProducts(): Promise<ProductWithPrice[]> {
    const response = await apiClient.get<ApiResponseType<Product[]>>('/api/v1/products');
    return response.data.filter(p => p.isAvailable) as ProductWithPrice[];
  }

  async getProductById(id: string): Promise<ProductWithPrice> {
    const response = await apiClient.get<ApiResponseType<Product>>(`/api/v1/products/${id}`);
    return response.data as ProductWithPrice;
  }
}

export const productService = new ProductService();
