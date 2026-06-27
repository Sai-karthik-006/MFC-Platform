import { apiClient } from '../lib/api-client';
import type { CartItem } from '../context/cart-context';

export interface OrderAddress {
  houseFlatNo: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderCustomer {
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface CreateOrderPayload {
  customer: OrderCustomer;
  address: OrderAddress;
  deliveryOption: 'home' | 'work' | 'other';
  deliveryInstructions?: string;
  items: CartItem[];
  paymentMethod: 'upi' | 'card' | 'cod';
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  grandTotal: number;
}

export interface OrderResponse {
  id: string;
  status: string;
  message: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  itemCount: number;
}

export interface OrderDetail extends Order {
  customer: OrderCustomer;
  address: OrderAddress;
  deliveryOption: 'home' | 'work' | 'other';
  deliveryInstructions?: string;
  items: CartItem[];
  paymentMethod: 'upi' | 'card' | 'cod';
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  grandTotal: number;
}

export class OrderService {
  async create(payload: CreateOrderPayload): Promise<OrderResponse> {
    return apiClient.post<OrderResponse>('/api/v1/orders', payload);
  }

  async getOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/api/v1/orders');
  }

  async getOrder(id: string): Promise<OrderDetail> {
    return apiClient.get<OrderDetail>(`/api/v1/orders/${id}`);
  }
}

export const orderService = new OrderService();