import { apiClient } from '../lib/api-client';
import type { ApiResponseType } from '@mfc-platform/types';

export const ADMIN_NOTIFICATION_TYPES = {
  ORDER_CONFIRMED: 'ORDER_CONFIRMED',
  ORDER_PREPARING: 'ORDER_PREPARING',
  ORDER_PICKED_UP: 'ORDER_PICKED_UP',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
  NEW_CATERING_REQUEST: 'NEW_CATERING_REQUEST',
  NEW_ORDER_ASSIGNED: 'NEW_ORDER_ASSIGNED',
} as const;

export type AdminNotificationType = (typeof ADMIN_NOTIFICATION_TYPES)[keyof typeof ADMIN_NOTIFICATION_TYPES];

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  orderId?: string | null;
  cateringId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export class AdminNotificationService {
  async getAll(): Promise<ApiResponseType<AdminNotification[]>> {
    return apiClient.get<ApiResponseType<AdminNotification[]>>('/api/v1/notifications');
  }

  async getUnreadCount(): Promise<ApiResponseType<{ count: number }>> {
    return apiClient.get<ApiResponseType<{ count: number }>>('/api/v1/notifications/unread-count');
  }

  async markAsRead(id: string): Promise<ApiResponseType<AdminNotification>> {
    return apiClient.patch<ApiResponseType<AdminNotification>>(`/api/v1/notifications/${id}/read`);
  }

  async markAllAsRead(): Promise<ApiResponseType<void>> {
    return apiClient.patch<ApiResponseType<void>>('/api/v1/notifications/read-all');
  }
}

export const adminNotificationService = new AdminNotificationService();