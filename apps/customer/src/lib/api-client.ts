import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { env } from './config';

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || env.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message =
          error.response?.data?.message || error.message || 'An unexpected error occurred';
        return Promise.reject(new Error(message));
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.request<T>(config);
    return response.data;
  }

  get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url: endpoint, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url: endpoint, method: 'POST', data: body });
  }

  put<T>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url: endpoint, method: 'PUT', data: body });
  }

  patch<T>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url: endpoint, method: 'PATCH', data: body });
  }

  delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url: endpoint, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
