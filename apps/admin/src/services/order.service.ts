import { apiClient } from '../lib/api-client';
import type { ApiResponseType } from '@mfc-platform/types';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  customer: string;
  total: number;
  payment: string;
  status: OrderStatus;
  date: string;
};

export class OrderService {
  async getOrders(): Promise<Order[]> {
    const response = await apiClient.get<ApiResponseType<Order[]>>('/orders');
    return response.data;
  }

  async updateOrderStatus(id: string, status: OrderStatus, notes?: string): Promise<void> {
    await apiClient.patch<ApiResponseType<void>>(`/orders/${id}/status`, { status, notes });
  }

  async deleteOrder(id: string): Promise<void> {
    await apiClient.delete<ApiResponseType<void>>(`/orders/${id}`);
  }
}

export const orderService = new OrderService();