import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { env } from './config';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearStoredTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || env.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = getStoredAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          clearStoredTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
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
