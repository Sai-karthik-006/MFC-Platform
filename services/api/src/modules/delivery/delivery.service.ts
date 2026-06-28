import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAssignedOrders() {
    const orders = await this.prisma.order.findMany({
      where: {
        orderStatus: {
          in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY],
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customerName,
      address: order.customerAddress,
      amount: `$${order.totalAmount.toFixed(2)}`,
      distance: this.calculateDistance(order.customerAddress),
      status: this.mapStatus(order.orderStatus),
      createdAt: order.createdAt,
    }));
  }

  async acceptDelivery(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.orderStatus !== OrderStatus.READY) {
      throw new BadRequestException('Order must be in READY status to accept delivery');
    }

    return this.prisma.order.update({
      where: { id },
      data: { orderStatus: OrderStatus.IN_TRANSIT },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async rejectDelivery(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.orderStatus !== OrderStatus.READY) {
      throw new BadRequestException('Order must be in READY status to reject delivery');
    }

    return this.prisma.order.update({
      where: { id },
      data: { orderStatus: OrderStatus.CONFIRMED },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async markPickedUp(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.orderStatus !== OrderStatus.IN_TRANSIT) {
      throw new BadRequestException('Order must be in IN_TRANSIT status to mark picked up');
    }

    return this.prisma.order.update({
      where: { id },
      data: { orderStatus: OrderStatus.COMPLETED },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async markDelivered(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.orderStatus !== OrderStatus.IN_TRANSIT) {
      throw new BadRequestException('Order must be in IN_TRANSIT status to mark delivered');
    }

    return this.prisma.order.update({
      where: { id },
      data: { orderStatus: OrderStatus.COMPLETED },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async findOrderById(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      id: order.orderNumber,
      customer: order.customerName,
      phone: order.customerPhone,
      address: order.customerAddress,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        price: `$${item.unitPrice.toFixed(2)}`,
      })),
      total: `$${order.totalAmount.toFixed(2)}`,
      paymentMethod: `Cash on Delivery`,
      notes: order.notes || '',
      status: order.orderStatus,
    };
  }

  private mapStatus(status: OrderStatus): 'assigned' | 'pending' | 'in-progress' | 'delivered' {
    switch (status) {
      case OrderStatus.PENDING:
      case OrderStatus.CONFIRMED:
        return 'pending';
      case OrderStatus.PREPARING:
        return 'in-progress';
      case OrderStatus.READY:
        return 'assigned';
      case OrderStatus.IN_TRANSIT:
        return 'in-progress';
      case OrderStatus.COMPLETED:
        return 'delivered';
      case OrderStatus.CANCELLED:
        return 'delivered';
      default:
        return 'pending';
    }
  }

  private calculateDistance(address: string): string {
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const distance = (hash % 10) + 1;
    return `${distance}.0 km`;
  }
}