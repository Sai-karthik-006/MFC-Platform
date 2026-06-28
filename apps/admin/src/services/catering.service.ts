import { apiClient } from '../lib/api-client';
import type { ApiResponseType } from '@mfc-platform/types';

export type CateringRequest = {
  id: string;
  company: string;
  eventDate: string;
  guests: number;
  budget: number;
  status: string;
};

export type CateringDetail = CateringRequest & {
  contactPerson: string;
  phone: string;
  email: string;
  eventTime: string;
  venue: string;
  selectedMenu: string;
  specialInstructions: string;
};

export type CateringStatus = 'New' | 'Contacted' | 'Quotation Sent' | 'Confirmed' | 'Completed' | 'Cancelled';

export class CateringService {
  async getRequests(): Promise<CateringRequest[]> {
    const response = await apiClient.get<ApiResponseType<CateringRequest[]>>('/catering');
    return response.data;
  }

  async updateRequestStatus(id: string, status: CateringStatus, notes?: string): Promise<void> {
    await apiClient.patch<ApiResponseType<void>>(`/catering/${id}/status`, { status, notes });
  }

  async deleteRequest(id: string): Promise<void> {
    await apiClient.delete<ApiResponseType<void>>(`/catering/${id}`);
  }
}

export const cateringService = new CateringService();
