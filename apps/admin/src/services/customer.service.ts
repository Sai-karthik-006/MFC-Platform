import { apiClient } from '../lib/api-client';
import type { ApiResponseType } from '@mfc-platform/types';

export type CustomerStatus = 'Active' | 'Inactive' | 'Suspended';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: CustomerStatus;
};

export class CustomerService {
  async getCustomers(): Promise<Customer[]> {
    const response = await apiClient.get<ApiResponseType<Customer[]>>('/customers');
    return response.data;
  }

  async disableCustomer(id: string): Promise<void> {
    await apiClient.patch<ApiResponseType<void>>(`/customers/${id}/disable`);
  }
}

export const customerService = new CustomerService();
