import { apiRequest } from '../lib/api-client';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: string;
  paymentMethod: string;
  notes: string;
  status: OrderStatus;
}

export class DeliveryService {
  async getOrders(): Promise<Order[]> {
    const response = await apiRequest<{ data: Order[] }>('/delivery/orders');
    return response.data || [];
  }

  async getOrder(id: string): Promise<Order> {
    const response = await apiRequest<Order>(`/delivery/orders/${id}`);
    return response;
  }

  async acceptOrder(orderId: string): Promise<void> {
    await apiRequest(`/delivery/orders/${orderId}/accept`, { method: 'PATCH' });
  }

  async rejectOrder(orderId: string): Promise<void> {
    await apiRequest(`/delivery/orders/${orderId}/reject`, { method: 'PATCH' });
  }

  async markPickedUp(orderId: string): Promise<void> {
    await apiRequest(`/delivery/orders/${orderId}/picked-up`, { method: 'PATCH' });
  }

  async markDelivered(orderId: string): Promise<void> {
    await apiRequest(`/delivery/orders/${orderId}/delivered`, { method: 'PATCH' });
  }
}

export const deliveryService = new DeliveryService();