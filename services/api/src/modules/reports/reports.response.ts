export interface BaseReportResponse {
  totalRecords: number;
  generatedAt: string;
  summary: Record<string, unknown>;
  preview: Record<string, unknown>[];
}

export interface DateRangeFilter {
  dateRange: 'today' | 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
}
