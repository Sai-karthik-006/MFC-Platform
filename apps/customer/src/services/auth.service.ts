import { apiClient } from '../lib/api-client';
import type { ApiResponseType } from '@mfc-platform/types';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    createdAt: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export class AuthService {
  async register(data: RegisterRequest): Promise<ApiResponseType<AuthResponse>> {
    return apiClient.post<ApiResponseType<AuthResponse>>('/api/v1/auth/register', data);
  }

  async login(data: LoginRequest): Promise<ApiResponseType<AuthResponse>> {
    return apiClient.post<ApiResponseType<AuthResponse>>('/api/v1/auth/login', data);
  }

  async logout(): Promise<void> {
    await apiClient.post<void>('/api/v1/auth/logout');
  }

  async refreshToken(data: RefreshRequest): Promise<ApiResponseType<AuthResponse>> {
    return apiClient.post<ApiResponseType<AuthResponse>>('/api/v1/auth/refresh', data);
  }

  async getMe(): Promise<ApiResponseType<AuthResponse['user']>> {
    return apiClient.get<ApiResponseType<AuthResponse['user']>>('/api/v1/auth/me');
  }
}

export const authService = new AuthService();
