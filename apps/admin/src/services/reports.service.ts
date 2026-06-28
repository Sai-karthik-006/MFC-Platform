import { apiClient } from '../lib/api-client';
import { env } from '../lib/config';
import type { ApiResponseType } from '@mfc-platform/types';

export interface DateRangeFilter {
  dateRange: 'today' | 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export interface ReportRow {
  [key: string]: unknown;
}

export interface ReportResponse {
  totalRecords: number;
  generatedAt: string;
  summary: Record<string, unknown>;
  preview: ReportRow[];
}

function buildQuery(params: DateRangeFilter): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.append(key, String(value));
    }
  });
  return search.toString();
}

export class ReportsService {
  async getSalesReport(filter: DateRangeFilter): Promise<ReportResponse> {
    const response = await apiClient.get<ApiResponseType<ReportResponse>>(
      '/reports/sales',
      { params: filter },
    );
    return response.data;
  }

  async getOrdersReport(filter: DateRangeFilter): Promise<ReportResponse> {
    const response = await apiClient.get<ApiResponseType<ReportResponse>>(
      '/reports/orders',
      { params: filter },
    );
    return response.data;
  }

  async getCustomersReport(filter: DateRangeFilter): Promise<ReportResponse> {
    const response = await apiClient.get<ApiResponseType<ReportResponse>>(
      '/reports/customers',
      { params: filter },
    );
    return response.data;
  }

  async getProductsReport(filter: DateRangeFilter): Promise<ReportResponse> {
    const response = await apiClient.get<ApiResponseType<ReportResponse>>(
      '/reports/products',
      { params: filter },
    );
    return response.data;
  }

  async getCateringReport(filter: DateRangeFilter): Promise<ReportResponse> {
    const response = await apiClient.get<ApiResponseType<ReportResponse>>(
      '/reports/catering',
      { params: filter },
    );
    return response.data;
  }

  async downloadSalesCsv(filter: DateRangeFilter): Promise<void> {
    await this.downloadCsv('/reports/sales/csv', filter, `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
  }

  async downloadOrdersCsv(filter: DateRangeFilter): Promise<void> {
    await this.downloadCsv('/reports/orders/csv', filter, `orders-report-${new Date().toISOString().split('T')[0]}.csv`);
  }

  async downloadCustomersCsv(filter: DateRangeFilter): Promise<void> {
    await this.downloadCsv('/reports/customers/csv', filter, `customers-report-${new Date().toISOString().split('T')[0]}.csv`);
  }

  async downloadProductsCsv(filter: DateRangeFilter): Promise<void> {
    await this.downloadCsv('/reports/products/csv', filter, `products-report-${new Date().toISOString().split('T')[0]}.csv`);
  }

  async downloadCateringCsv(filter: DateRangeFilter): Promise<void> {
    await this.downloadCsv('/reports/catering/csv', filter, `catering-report-${new Date().toISOString().split('T')[0]}.csv`);
  }

  async downloadSalesPdf(filter: DateRangeFilter): Promise<void> {
    await this.downloadPdf('/reports/sales/pdf', filter, `sales-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async downloadOrdersPdf(filter: DateRangeFilter): Promise<void> {
    await this.downloadPdf('/reports/orders/pdf', filter, `orders-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async downloadCustomersPdf(filter: DateRangeFilter): Promise<void> {
    await this.downloadPdf('/reports/customers/pdf', filter, `customers-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async downloadProductsPdf(filter: DateRangeFilter): Promise<void> {
    await this.downloadPdf('/reports/products/pdf', filter, `products-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async downloadCateringPdf(filter: DateRangeFilter): Promise<void> {
    await this.downloadPdf('/reports/catering/pdf', filter, `catering-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private async downloadCsv(endpoint: string, params: DateRangeFilter, filename: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_access_token') : null;
    const url = `${env.API_URL}${endpoint}?${buildQuery(params)}`;

    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to download CSV: ${response.status} ${text}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  }

  private async downloadPdf(endpoint: string, params: DateRangeFilter, filename: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_access_token') : null;
    const url = `${env.API_URL}${endpoint}?${buildQuery(params)}`;

    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to download PDF: ${response.status} ${text}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  }
}

export const reportsService = new ReportsService();
