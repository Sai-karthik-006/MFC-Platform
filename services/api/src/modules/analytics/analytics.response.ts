export interface DateRangeFilter {
  dateRange: 'today' | 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
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
  kpi: {
    revenue: string;
    orders: number;
    customers: number;
    products: number;
    revenueChange: string;
    ordersChange: string;
    customersChange: string;
  };
  revenueTrend: RevenueTrendPoint[];
  ordersTrend: OrdersTrendPoint[];
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  recentSales: RecentSale[];
  categoryDistribution: CategoryDistribution[];
}
