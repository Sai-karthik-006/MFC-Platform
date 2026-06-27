import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImageService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProductId(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const images = await this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        productId: true,
        imageUrl: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        createdAt: true,
      },
    });

    return images;
  }

  async findById(id: string) {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
      select: {
        id: true,
        productId: true,
        imageUrl: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        createdAt: true,
      },
    });

    if (!image) {
      throw new NotFoundException('Product image not found');
    }

    return image;
  }

  async create(productId: string, dto: CreateProductImageDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const sortOrder = parseInt(dto.sortOrder || '0', 10);
    const isPrimary = dto.isPrimary ?? false;

    await this.prisma.$transaction(async (tx) => {
      if (isPrimary) {
        await tx.productImage.updateMany({
          where: { productId, isPrimary: true },
          data: { isPrimary: false },
        });
      }

      await tx.productImage.create({
        data: {
          productId,
          imageUrl: dto.imageUrl,
          altText: dto.altText,
          sortOrder,
          isPrimary,
        },
      });
    });

    const image = await this.prisma.productImage.findFirst({
      where: { productId, imageUrl: dto.imageUrl, isPrimary },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        productId: true,
        imageUrl: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        createdAt: true,
      },
    });

    if (!image) {
      throw new BadRequestException('Failed to create product image');
    }

    return image;
  }

  async update(id: string, dto: UpdateProductImageDto) {
    const existing = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product image not found');
    }

    const isPrimary = dto.isPrimary ?? existing.isPrimary;
    const sortOrder = dto.sortOrder !== undefined ? parseInt(dto.sortOrder, 10) : existing.sortOrder;

    await this.prisma.$transaction(async (tx) => {
      if (isPrimary) {
        await tx.productImage.updateMany({
          where: { productId: existing.productId, id: { not: id }, isPrimary: true },
          data: { isPrimary: false },
        });
      }

      await tx.productImage.update({
        where: { id },
        data: {
          ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
          ...(dto.altText !== undefined && { altText: dto.altText }),
          sortOrder,
          isPrimary,
        },
      });
    });

    const updated = await this.prisma.productImage.findUnique({
      where: { id },
      select: {
        id: true,
        productId: true,
        imageUrl: true,
        altText: true,
        sortOrder: true,
        isPrimary: true,
        createdAt: true,
      },
    });

    return updated;
  }

  async remove(id: string) {
    const existing = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product image not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.productImage.delete({
        where: { id },
      });

      if (existing.isPrimary) {
        const firstRemaining = await tx.productImage.findFirst({
          where: { productId: existing.productId },
          orderBy: { sortOrder: 'asc' },
        });

        if (firstRemaining) {
          await tx.productImage.update({
            where: { id: firstRemaining.id },
            data: { isPrimary: true },
          });
        }
      }
    });

    return { id };
  }
}
