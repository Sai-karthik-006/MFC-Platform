import { axiosClient } from '../lib/axios';
import type { ApiResponseType, ApiErrorType } from '@mfc-platform/types';

export class ApiClient {
  async get<T>(endpoint: string): Promise<ApiResponseType<T>> {
    const response = await axiosClient.get<ApiResponseType<T>>(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponseType<T>> {
    const response = await axiosClient.post<ApiResponseType<T>>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponseType<T>> {
    const response = await axiosClient.put<ApiResponseType<T>>(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponseType<T>> {
    const response = await axiosClient.patch<ApiResponseType<T>>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<ApiResponseType<T>> {
    const response = await axiosClient.delete<ApiResponseType<T>>(endpoint);
    return response.data;
  }
}

