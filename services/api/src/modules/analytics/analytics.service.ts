import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DateRangeFilter } from './analytics.response';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateBounds(filter: DateRangeFilter): { start: Date; end: Date } {
    const now = new Date();
    let start: Date;
    switch (filter.dateRange) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
      default:
        start = filter.startDate || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }
    const end = filter.endDate || now;
    return { start, end };
  }

  async getAnalytics(filter: DateRangeFilter) {
    const { start, end } = this.getDateBounds(filter);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const ordersCount = orders.length;
    const totalRevenue = orders.reduce(
      (sum, o) => sum + Number(o.totalAmount),
      0,
    );

    const previousStart = new Date(start.getTime() - (end.getTime() - start.getTime()));
    const previousOrders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: previousStart, lt: start },
      },
    });
    const previousRevenue = previousOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount),
      0,
    );
    const previousOrdersCount = previousOrders.length;

    const uniqueCustomers = new Set(
      orders
        .filter((o) => o.customerEmail)
        .map((o) => o.customerEmail!),
    );
    const previousUniqueCustomers = new Set(
      previousOrders
        .filter((o) => o.customerEmail)
        .map((o) => o.customerEmail!),
    );

    const productsCount = await this.prisma.product.count();

    const revenueChange =
      previousRevenue > 0
        ? (((totalRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
        : '0.0';
    const ordersChange =
      previousOrdersCount > 0
        ? (((ordersCount - previousOrdersCount) / previousOrdersCount) * 100).toFixed(1)
        : '0.0';
    const customersChange =
      previousUniqueCustomers.size > 0
        ? (
            ((uniqueCustomers.size - previousUniqueCustomers.size) /
              previousUniqueCustomers.size) *
            100
          ).toFixed(1)
        : '0.0';

    const revenueTrend = this.buildTrendData(orders, start, end, filter.dateRange);
    const ordersTrend = this.buildOrdersTrendData(orders, start, end, filter.dateRange);

    const productSalesMap = new Map<string, { name: string; sold: number; revenue: number }>();
    const customerSpendMap = new Map<string, { email: string; name: string; spent: number; orders: number }>();
    const categoryMap = new Map<string, number>();

    for (const order of orders) {
      for (const item of order.items) {
        const productName = item.productName;
        const existing = productSalesMap.get(productName) || { name: productName, sold: 0, revenue: 0 };
        existing.sold += item.quantity;
        existing.revenue += Number(item.total);
        productSalesMap.set(productName, existing);

        const catName = item.variant.product.category.name;
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + item.quantity);
      }

      if (order.customerEmail) {
        const existing = customerSpendMap.get(order.customerEmail) || {
          email: order.customerEmail,
          name: order.customerName,
          spent: 0,
          orders: 0,
        };
        existing.spent += Number(order.totalAmount);
        existing.orders += 1;
        customerSpendMap.set(order.customerEmail, existing);
      }
    }

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        sold: p.sold,
        revenue: `$${p.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      }));

    const topCustomers = Array.from(customerSpendMap.values())
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5)
      .map((c) => ({
        name: c.name,
        email: c.email,
        spent: `$${c.spent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        orders: c.orders,
      }));

    const totalSold = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0) || 1;
    const categoryDistribution = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value: Math.round((value / totalSold) * 100),
    }));

    const recentSales = orders.slice(0, 5).map((o) => ({
      id: o.orderNumber,
      customer: o.customerName,
      amount: `$${Number(o.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status: this.formatStatus(o.orderStatus),
      date: new Date(o.createdAt).toISOString().split('T')[0],
    }));

    return {
      kpi: {
        revenue: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        orders: ordersCount,
        customers: uniqueCustomers.size,
        products: productsCount,
        revenueChange: `${parseFloat(revenueChange) >= 0 ? '+' : ''}${revenueChange}%`,
        ordersChange: `${parseFloat(ordersChange) >= 0 ? '+' : ''}${ordersChange}%`,
        customersChange: `${parseFloat(customersChange) >= 0 ? '+' : ''}${customersChange}%`,
      },
      revenueTrend,
      ordersTrend,
      topProducts,
      topCustomers,
      recentSales,
      categoryDistribution,
    };
  }

  private buildTrendData(
    orders: { totalAmount: Decimal; createdAt: Date }[],
    start: Date,
    end: Date,
    range: string,
  ) {
    const data: { period: string; revenue: number }[] = [];
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (range === 'today' || range === 'week') {
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayRevenue = orders
          .filter((o) => o.createdAt.toDateString() === d.toDateString())
          .reduce((sum, o) => sum + Number(o.totalAmount), 0);
        data.push({ period: label, revenue: dayRevenue });
      }
    } else {
      const months: { key: string; revenue: number }[] = [];
      const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cursor <= end) {
        const key = cursor.toLocaleDateString('en-US', { month: 'short' });
        const monthRevenue = orders
          .filter((o) => {
            const d = new Date(o.createdAt);
            return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
          })
          .reduce((sum, o) => sum + Number(o.totalAmount), 0);
        months.push({ key, revenue: monthRevenue });
        cursor.setMonth(cursor.getMonth() + 1);
      }
      for (const m of months) {
        data.push({ period: m.key, revenue: m.revenue });
      }
    }

    return data.map((d) => ({
      period: d.period,
      revenue: `$${d.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    }));
  }

  private buildOrdersTrendData(
    orders: { createdAt: Date }[],
    start: Date,
    end: Date,
    range: string,
  ) {
    const data: { period: string; orders: number }[] = [];
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (range === 'today' || range === 'week') {
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const count = orders.filter((o) => o.createdAt.toDateString() === d.toDateString()).length;
        data.push({ period: label, orders: count });
      }
    } else {
      const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cursor <= end) {
        const key = cursor.toLocaleDateString('en-US', { month: 'short' });
        const count = orders.filter((o) => {
          const d = new Date(o.createdAt);
          return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
        }).length;
        data.push({ period: key, orders: count });
        cursor.setMonth(cursor.getMonth() + 1);
      }
    }

    return data.map((d) => ({
      period: d.period,
      orders: d.orders,
    }));
  }

  private formatStatus(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Processing',
      CONFIRMED: 'Confirmed',
      PREPARING: 'Preparing',
      READY: 'Ready',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };
    return map[status] || status;
  }
}
