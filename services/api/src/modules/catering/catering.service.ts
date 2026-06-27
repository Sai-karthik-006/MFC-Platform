import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCateringRequestDto } from './dto/create-catering-request.dto';

@Injectable()
export class CateringService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCateringRequestDto) {
    const catering = await this.prisma.cateringRequest.create({
      data: {
        customerName: dto.customerName,
        phone: dto.phone,
        email: dto.email,
        eventType: dto.eventType,
        eventDate: new Date(dto.eventDate),
        guestCount: dto.guestCount,
        message: dto.message,
        status: 'PENDING',
      },
      select: {
        id: true,
        customerName: true,
        phone: true,
        email: true,
        eventType: true,
        eventDate: true,
        guestCount: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return catering;
  }

  async findAll() {
    const inquiries = await this.prisma.cateringRequest.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        customerName: true,
        phone: true,
        email: true,
        eventType: true,
        eventDate: true,
        guestCount: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return inquiries;
  }

  async findById(id: string) {
    const inquiry = await this.prisma.cateringRequest.findUnique({
      where: { id },
      select: {
        id: true,
        customerName: true,
        phone: true,
        email: true,
        eventType: true,
        eventDate: true,
        guestCount: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!inquiry) {
      throw new NotFoundException('Catering inquiry not found');
    }

    return inquiry;
  }

  async updateStatus(id: string, status: string) {
    const inquiry = await this.prisma.cateringRequest.findUnique({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException('Catering inquiry not found');
    }

    const updated = await this.prisma.cateringRequest.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        customerName: true,
        phone: true,
        email: true,
        eventType: true,
        eventDate: true,
        guestCount: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }
}
