import { apiClient } from '../lib/api-client';
import type { ApiResponseType, Notification } from '@mfc-platform/types';
export type { Notification };

export const NOTIFICATION_TYPES = {
  ORDER_CONFIRMED: 'ORDER_CONFIRMED',
  ORDER_PREPARING: 'ORDER_PREPARING',
  ORDER_PICKED_UP: 'ORDER_PICKED_UP',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
  NEW_CATERING_REQUEST: 'NEW_CATERING_REQUEST',
  NEW_ORDER_ASSIGNED: 'NEW_ORDER_ASSIGNED',
} as const;

export class NotificationService {
  async getAll(): Promise<ApiResponseType<Notification[]>> {
    return apiClient.get<ApiResponseType<Notification[]>>('/api/v1/notifications');
  }

  async getUnreadCount(): Promise<ApiResponseType<{ count: number }>> {
    return apiClient.get<ApiResponseType<{ count: number }>>('/api/v1/notifications/unread-count');
  }

  async markAsRead(id: string): Promise<ApiResponseType<Notification>> {
    return apiClient.patch<ApiResponseType<Notification>>(`/api/v1/notifications/${id}/read`);
  }

  async markAllAsRead(): Promise<ApiResponseType<void>> {
    return apiClient.patch<ApiResponseType<void>>('/api/v1/notifications/read-all');
  }
}

export const notificationService = new NotificationService();
