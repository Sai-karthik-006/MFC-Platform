import { apiRequest } from '../lib/api-client';
import type { ApiResponseType } from '@mfc-platform/types';

export const DELIVERY_NOTIFICATION_TYPES = {
  ORDER_CONFIRMED: 'ORDER_CONFIRMED',
  ORDER_PREPARING: 'ORDER_PREPARING',
  ORDER_PICKED_UP: 'ORDER_PICKED_UP',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
  NEW_CATERING_REQUEST: 'NEW_CATERING_REQUEST',
  NEW_ORDER_ASSIGNED: 'NEW_ORDER_ASSIGNED',
} as const;

export type DeliveryNotificationType = (typeof DELIVERY_NOTIFICATION_TYPES)[keyof typeof DELIVERY_NOTIFICATION_TYPES];

export interface DeliveryNotification {
  id: string;
  type: DeliveryNotificationType;
  title: string;
  message: string;
  orderId?: string | null;
  cateringId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export class DeliveryNotificationService {
  async getAll(): Promise<ApiResponseType<DeliveryNotification[]>> {
    return apiRequest<ApiResponseType<DeliveryNotification[]>>('/api/v1/notifications');
  }

  async getUnreadCount(): Promise<ApiResponseType<{ count: number }>> {
    return apiRequest<ApiResponseType<{ count: number }>>('/api/v1/notifications/unread-count');
  }

  async markAsRead(id: string): Promise<ApiResponseType<DeliveryNotification>> {
    return apiRequest<ApiResponseType<DeliveryNotification>>(`/api/v1/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllAsRead(): Promise<ApiResponseType<void>> {
    return apiRequest<ApiResponseType<void>>('/api/v1/notifications/read-all', { method: 'PATCH' });
  }
}

export const deliveryNotificationService = new DeliveryNotificationService();