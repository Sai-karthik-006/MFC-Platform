import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}${random}`;
  }

  async create(dto: CreateOrderDto) {
    const variants = await this.prisma.productVariant.findMany({
      where: {
        id: {
          in: dto.items.map((item) => item.productVariantId),
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
      },
    });

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    for (const item of dto.items) {
      const variant = variantMap.get(item.productVariantId);
      if (!variant) {
        throw new BadRequestException(`Variant ${item.productVariantId} not found`);
      }
      if (variant.stock <= 0) {
        throw new BadRequestException(`Variant ${variant.name} is out of stock`);
      }
      if (variant.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${variant.name}`);
      }
    }

    const subtotal = new Decimal(
      dto.items.reduce((sum, item) => {
        const variant = variantMap.get(item.productVariantId)!;
        return sum + Number(variant.price) * item.quantity;
      }, 0),
    );

    const deliveryCharge = new Decimal(0);
    const discount = new Decimal(0);
    const totalAmount = subtotal.add(deliveryCharge).sub(discount);

    let orderNumber: string;
    do {
      orderNumber = this.generateOrderNumber();
      const existing = await this.prisma.order.findUnique({
        where: { orderNumber },
      });
      if (!existing) break;
    } while (true);

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerEmail: dto.customerEmail,
          customerAddress: dto.customerAddress,
          landmark: dto.landmark,
          notes: dto.notes,
          subtotal,
          deliveryCharge,
          discount,
          totalAmount,
          paymentMethod: 'CASH_ON_DELIVERY',
          paymentStatus: 'PENDING',
        },
      });

      for (const item of dto.items) {
        const variant = variantMap.get(item.productVariantId)!;
        const unitPrice = Number(variant.price);
        const total = unitPrice * item.quantity;

        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productVariantId: item.productVariantId,
            productName: variant.name,
            variantName: variant.name,
            unitPrice,
            quantity: item.quantity,
            total,
          },
        });

        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdOrder;
    });

    const orderWithItems = await this.prisma.order.findUnique({
      where: { id: order.id },
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

    return orderWithItems;
  }

  async findByOrderNumber(orderNumber: string) {
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

    return order;
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
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

    return orders;
  }

  private readonly allowedTransitions: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PREPARING', 'CANCELLED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
  };

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const currentStatus = order.orderStatus;
    const allowed = this.allowedTransitions[currentStatus] || [];

    if (!allowed.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${status}`,
      );
    }

    const isCancelling = status === 'CANCELLED';

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      if (isCancelling) {
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      return tx.order.update({
        where: { id },
        data: { orderStatus: status },
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
    });

    return updatedOrder;
  }
}
