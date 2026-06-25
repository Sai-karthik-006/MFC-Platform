import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductVariantService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProductId(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variants = await this.prisma.productVariant.findMany({
      where: { productId, stock: { gt: 0 } },
      orderBy: { price: 'asc' },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true,
        isDefault: true,
        productId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return variants;
  }

  async findById(id: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true,
        isDefault: true,
        productId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    return variant;
  }

  async create(productId: string, dto: CreateProductVariantDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingSku = await this.prisma.productVariant.findUnique({
      where: { sku: dto.sku },
    });

    if (existingSku) {
      throw new ConflictException('SKU already exists');
    }

    if (dto.isDefault) {
      await this.prisma.productVariant.updateMany({
        where: { productId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        productId,
        name: dto.name,
        sku: dto.sku,
        price: dto.price,
        stock: dto.stock ?? 0,
        isDefault: dto.isDefault ?? false,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true,
        isDefault: true,
        productId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return variant;
  }

  async update(id: string, dto: UpdateProductVariantDto) {
    const existing = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product variant not found');
    }

    if (dto.sku && dto.sku !== existing.sku) {
      const skuExists = await this.prisma.productVariant.findUnique({
        where: { sku: dto.sku },
      });

      if (skuExists) {
        throw new ConflictException('SKU already exists');
      }
    }

    if (dto.isDefault) {
      await this.prisma.productVariant.updateMany({
        where: { productId: existing.productId, id: { not: id }, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updated = await this.prisma.productVariant.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.sku !== undefined && { sku: dto.sku }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.stock !== undefined && { stock: dto.stock }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true,
        isDefault: true,
        productId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async softDelete(id: string) {
    const existing = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product variant not found');
    }

    const wasDefault = existing.isDefault;

    await this.prisma.productVariant.update({
      where: { id },
      data: { stock: 0, isDefault: false },
    });

    if (wasDefault) {
      const fallback = await this.prisma.productVariant.findFirst({
        where: { productId: existing.productId, id: { not: id }, stock: { gt: 0 } },
        orderBy: { createdAt: 'asc' },
      });

      if (fallback) {
        await this.prisma.productVariant.update({
          where: { id: fallback.id },
          data: { isDefault: true },
        });
      }
    }

    return { id, stock: 0 };
  }
}
