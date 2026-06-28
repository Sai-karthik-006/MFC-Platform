import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DateRangeFilter } from '../analytics/analytics.response';

export interface BaseReportResponse {
  totalRecords: number;
  generatedAt: string;
  summary: Record<string, unknown>;
  preview: Record<string, unknown>[];
}

@Injectable()
export class ReportsService {
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

  async getSalesReport(filter: DateRangeFilter): Promise<BaseReportResponse> {
    const { start, end } = this.getDateBounds(filter);

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: { category: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID').length;

    const productSalesMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const order of orders) {
      for (const item of order.items) {
        const existing = productSalesMap.get(item.productName) || {
          name: item.productName,
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += item.quantity;
        existing.revenue += Number(item.total);
        productSalesMap.set(item.productName, existing);
      }
    }

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((p) => ({
        product: p.name,
        quantitySold: p.quantity,
        revenue: Number(p.revenue.toFixed(2)),
      }));

    const preview = orders.slice(0, 10).map((o) => ({
      orderNumber: o.orderNumber,
      customer: o.customerName,
      total: Number(o.totalAmount),
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      date: o.createdAt.toISOString().split('T')[0],
    }));

    return {
      totalRecords: totalOrders,
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        paidOrders,
        pendingOrders: totalOrders - paidOrders,
        topProducts: topProducts.slice(0, 5),
      },
      preview,
    };
  }

  async getOrdersReport(filter: DateRangeFilter): Promise<BaseReportResponse> {
    const { start, end } = this.getDateBounds(filter);

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: 'desc' },
    });

    const totalOrders = orders.length;
    const statusCounts = new Map<string, number>();
    for (const order of orders) {
      statusCounts.set(order.orderStatus, (statusCounts.get(order.orderStatus) || 0) + 1);
    }

    const statusBreakdown = Object.fromEntries(statusCounts.entries());
    const completedOrders = statusCounts.get('COMPLETED') || 0;
    const cancelledOrders = statusCounts.get('CANCELLED') || 0;
    const fulfillmentRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100) : 0;

    const preview = orders.slice(0, 10).map((o) => ({
      orderNumber: o.orderNumber,
      customer: o.customerName,
      phone: o.customerPhone,
      total: Number(o.totalAmount),
      status: o.orderStatus,
      paymentStatus: o.paymentStatus,
      date: o.createdAt.toISOString().split('T')[0],
    }));

    return {
      totalRecords: totalOrders,
      generatedAt: new Date().toISOString(),
      summary: {
        totalOrders,
        completedOrders,
        cancelledOrders,
        fulfillmentRate: Number(fulfillmentRate.toFixed(1)),
        statusBreakdown,
        totalRevenue: Number(
          orders.reduce((sum, o) => sum + Number(o.totalAmount), 0).toFixed(2),
        ),
      },
      preview,
    };
  }

  async getCustomersReport(filter: DateRangeFilter): Promise<BaseReportResponse> {
    const { start, end } = this.getDateBounds(filter);

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: {
        customerEmail: true,
        customerName: true,
        customerPhone: true,
        totalAmount: true,
        createdAt: true,
        orderStatus: true,
        orderNumber: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const customerSpendMap = new Map<string, {
      name: string;
      phone: string;
      email: string;
      totalSpent: number;
      orderCount: number;
      firstOrder: string;
      lastOrder: string;
    }>();

    for (const order of orders) {
      const email = order.customerEmail || 'guest';
      const existing = customerSpendMap.get(email) || {
        name: order.customerName,
        phone: order.customerPhone,
        email,
        totalSpent: 0,
        orderCount: 0,
        firstOrder: order.createdAt.toISOString().split('T')[0],
        lastOrder: order.createdAt.toISOString().split('T')[0],
      };
      existing.totalSpent += Number(order.totalAmount);
      existing.orderCount += 1;
      existing.lastOrder = order.createdAt.toISOString().split('T')[0];
      customerSpendMap.set(email, existing);
    }

    const totalCustomers = customerSpendMap.size;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const averageSpend = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    const repeatCustomers = Array.from(customerSpendMap.values()).filter((c) => c.orderCount > 1).length;

    const topCustomers = Array.from(customerSpendMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)
      .map((c) => ({
        name: c.name,
        email: c.email,
        phone: c.phone,
        totalSpent: Number(c.totalSpent.toFixed(2)),
        orders: c.orderCount,
        lastOrder: c.lastOrder,
      }));

    const preview = orders.slice(0, 10).map((o) => ({
      orderNumber: o.orderNumber,
      customer: o.customerName,
      email: o.customerEmail || 'N/A',
      total: Number(o.totalAmount),
      date: o.createdAt.toISOString().split('T')[0],
    }));

    return {
      totalRecords: totalCustomers,
      generatedAt: new Date().toISOString(),
      summary: {
        totalCustomers,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        averageSpend: Number(averageSpend.toFixed(2)),
        repeatCustomers,
        repeatRate: totalCustomers > 0 ? Number(((repeatCustomers / totalCustomers) * 100).toFixed(1)) : 0,
        topCustomers,
      },
      preview,
    };
  }

  async getProductsReport(filter: DateRangeFilter): Promise<BaseReportResponse> {
    const { start, end } = this.getDateBounds(filter);

    const [products, orders] = await Promise.all([
      this.prisma.product.findMany({
        include: {
          category: true,
          variants: {
          select: {
            id: true,
            name: true,
            stock: true,
            price: true,
          },
          },
        },
      }),
      this.prisma.order.findMany({
        where: { createdAt: { gte: start, lte: end } },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: { category: true },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    const productSalesMap = new Map<string, {
      name: string;
      category: string;
      totalSold: number;
      revenue: number;
      orderCount: number;
    }>();

    for (const order of orders) {
      for (const item of order.items) {
        const productId = item.variant.product.id;
        const existing = productSalesMap.get(productId) || {
          name: item.productName,
          category: item.variant.product.category.name,
          totalSold: 0,
          revenue: 0,
          orderCount: 0,
        };
        existing.totalSold += item.quantity;
        existing.revenue += Number(item.total);
        existing.orderCount += 1;
        productSalesMap.set(productId, existing);
      }
    }

    const totalProductsSold = Array.from(productSalesMap.values()).reduce((s, p) => s + p.totalSold, 0);
    const totalRevenue = Array.from(productSalesMap.values()).reduce((s, p) => s + p.revenue, 0);

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((p) => ({
        name: p.name,
        category: p.category,
        unitsSold: p.totalSold,
        revenue: Number(p.revenue.toFixed(2)),
        orders: p.orderCount,
      }));

    const lowStock = products
      .filter((p) => p.variants.some((v) => v.stock < 10))
      .map((p) => ({
        name: p.name,
        category: p.category.name,
        stock: p.variants.reduce((s, v) => s + v.stock, 0),
        available: p.isAvailable,
      }));

    const preview = products.slice(0, 10).map((p) => ({
      name: p.name,
      category: p.category.name,
      price: Number(p.variants[0]?.price || 0),
      stock: p.variants.reduce((s, v) => s + v.stock, 0),
      available: p.isAvailable,
      unitsSold: productSalesMap.get(p.id)?.totalSold || 0,
    }));

    return {
      totalRecords: products.length,
      generatedAt: new Date().toISOString(),
      summary: {
        totalProducts: products.length,
        totalProductsSold,
        totalProductRevenue: Number(totalRevenue.toFixed(2)),
        lowStockCount: lowStock.length,
        lowStockProducts: lowStock,
        topProducts,
      },
      preview,
    };
  }

  async getCateringReport(filter: DateRangeFilter): Promise<BaseReportResponse> {
    const { start, end } = this.getDateBounds(filter);

    const inquiries = await this.prisma.cateringRequest.findMany({
      where: { createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: 'desc' },
    });

    const totalInquiries = inquiries.length;
    const statusCounts = new Map<string, number>();
    const guestCountTotal = inquiries.reduce((sum, i) => sum + i.guestCount, 0);

    for (const inquiry of inquiries) {
      statusCounts.set(inquiry.status, (statusCounts.get(inquiry.status) || 0) + 1);
    }

    const statusBreakdown = Object.fromEntries(statusCounts.entries());
    const eventTypes = new Map<string, number>();
    for (const inquiry of inquiries) {
      eventTypes.set(inquiry.eventType, (eventTypes.get(inquiry.eventType) || 0) + 1);
    }

    const eventTypeBreakdown = Object.fromEntries(eventTypes.entries());
    const avgGuests = totalInquiries > 0 ? guestCountTotal / totalInquiries : 0;

    const preview = inquiries.slice(0, 10).map((i) => ({
      id: i.id,
      customerName: i.customerName,
      eventType: i.eventType,
      guestCount: i.guestCount,
      status: i.status,
      eventDate: i.eventDate.toISOString().split('T')[0],
      createdAt: i.createdAt.toISOString().split('T')[0],
    }));

    return {
      totalRecords: totalInquiries,
      generatedAt: new Date().toISOString(),
      summary: {
        totalInquiries,
        totalGuests: guestCountTotal,
        averageGuests: Number(avgGuests.toFixed(1)),
        statusBreakdown,
        eventTypeBreakdown,
      },
      preview,
    };
  }

  private csvEscape(value: unknown): string {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private toCsv(records: Record<string, unknown>[]): string {
    if (records.length === 0) return '';
    const headers = Object.keys(records[0]);
    const rows = records.map((r) => headers.map((h) => this.csvEscape(r[h])).join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  async getSalesCsv(filter: DateRangeFilter): Promise<string> {
    const { start, end } = this.getDateBounds(filter);
    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: {
        items: {
          include: {
            variant: { include: { product: { include: { category: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const records = orders.map((o) => ({
      orderNumber: o.orderNumber,
      customer: o.customerName,
      total: Number(o.totalAmount).toFixed(2),
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      date: o.createdAt.toISOString().split('T')[0],
    }));
    return this.toCsv(records);
  }

  async getOrdersCsv(filter: DateRangeFilter): Promise<string> {
    const { start, end } = this.getDateBounds(filter);
    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: 'desc' },
    });
    const records = orders.map((o) => ({
      orderNumber: o.orderNumber,
      customer: o.customerName,
      phone: o.customerPhone,
      total: Number(o.totalAmount).toFixed(2),
      status: o.orderStatus,
      paymentStatus: o.paymentStatus,
      date: o.createdAt.toISOString().split('T')[0],
    }));
    return this.toCsv(records);
  }

  async getCustomersCsv(filter: DateRangeFilter): Promise<string> {
    const { start, end } = this.getDateBounds(filter);
    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: {
        customerEmail: true,
        customerName: true,
        customerPhone: true,
        totalAmount: true,
        createdAt: true,
        orderStatus: true,
        orderNumber: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const customerSpendMap = new Map<string, {
      name: string;
      phone: string;
      email: string;
      totalSpent: number;
      orderCount: number;
      firstOrder: string;
      lastOrder: string;
    }>();

    for (const order of orders) {
      const email = order.customerEmail || 'guest';
      const existing = customerSpendMap.get(email) || {
        name: order.customerName,
        phone: order.customerPhone,
        email,
        totalSpent: 0,
        orderCount: 0,
        firstOrder: order.createdAt.toISOString().split('T')[0],
        lastOrder: order.createdAt.toISOString().split('T')[0],
      };
      existing.totalSpent += Number(order.totalAmount);
      existing.orderCount += 1;
      existing.lastOrder = order.createdAt.toISOString().split('T')[0];
      customerSpendMap.set(email, existing);
    }

    const records = Array.from(customerSpendMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .map((c) => ({
        name: c.name,
        email: c.email,
        phone: c.phone,
        totalSpent: Number(c.totalSpent.toFixed(2)),
        orders: c.orderCount,
        firstOrder: c.firstOrder,
        lastOrder: c.lastOrder,
      }));

    return this.toCsv(records);
  }

  async getProductsCsv(filter: DateRangeFilter): Promise<string> {
    const { start, end } = this.getDateBounds(filter);
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
        variants: {
          select: { id: true, name: true, stock: true, price: true },
        },
      },
    });

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { include: { category: true } },
              },
            },
          },
        },
      },
    });

    const productSalesMap = new Map<string, {
      name: string;
      category: string;
      totalSold: number;
      revenue: number;
      orderCount: number;
    }>();

    for (const order of orders) {
      for (const item of order.items) {
        const productId = item.variant.product.id;
        const existing = productSalesMap.get(productId) || {
          name: item.productName,
          category: item.variant.product.category.name,
          totalSold: 0,
          revenue: 0,
          orderCount: 0,
        };
        existing.totalSold += item.quantity;
        existing.revenue += Number(item.total);
        existing.orderCount += 1;
        productSalesMap.set(productId, existing);
      }
    }

    const records = products.map((p) => ({
      name: p.name,
      category: p.category.name,
      price: Number(p.variants[0]?.price || 0).toFixed(2),
      stock: p.variants.reduce((s, v) => s + v.stock, 0),
      available: p.isAvailable,
      unitsSold: productSalesMap.get(p.id)?.totalSold || 0,
    }));

    return this.toCsv(records);
  }

  async getCateringCsv(filter: DateRangeFilter): Promise<string> {
    const { start, end } = this.getDateBounds(filter);
    const inquiries = await this.prisma.cateringRequest.findMany({
      where: { createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: 'desc' },
    });

    const records = inquiries.map((i) => ({
      id: i.id,
      customerName: i.customerName,
      eventType: i.eventType,
      guestCount: i.guestCount,
      status: i.status,
      eventDate: i.eventDate.toISOString().split('T')[0],
      createdAt: i.createdAt.toISOString().split('T')[0],
    }));

    return this.toCsv(records);
  }
}
