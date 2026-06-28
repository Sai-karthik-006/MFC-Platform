import { apiClient } from '../lib/api-client';
import type { ApiResponseType } from '@mfc-platform/types';

export interface DateRangeFilter {
  dateRange: 'today' | 'week' | 'month' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsKpi {
  revenue: string;
  orders: number;
  customers: number;
  products: number;
  revenueChange: string;
  ordersChange: string;
  customersChange: string;
}

export interface RevenueTrendPoint {
  period: string;
  revenue: string;
}

export interface OrdersTrendPoint {
  period: string;
  orders: number;
}

export interface TopProduct {
  name: string;
  sold: number;
  revenue: string;
}

export interface TopCustomer {
  name: string;
  email: string;
  spent: string;
  orders: number;
}

export interface RecentSale {
  id: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
}

export interface CategoryDistribution {
  name: string;
  value: number;
}

export interface AnalyticsResponse {
  kpi: AnalyticsKpi;
  revenueTrend: RevenueTrendPoint[];
  ordersTrend: OrdersTrendPoint[];
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  recentSales: RecentSale[];
  categoryDistribution: CategoryDistribution[];
}

export class AnalyticsService {
  async getAnalytics(filter: DateRangeFilter): Promise<AnalyticsResponse> {
    const params = new URLSearchParams();
    params.set('dateRange', filter.dateRange);
    if (filter.startDate) params.set('startDate', filter.startDate);
    if (filter.endDate) params.set('endDate', filter.endDate);

    const response = await apiClient.get<ApiResponseType<AnalyticsResponse>>(
      `/analytics?${params.toString()}`,
    );
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
