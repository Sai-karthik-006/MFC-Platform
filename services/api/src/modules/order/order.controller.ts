import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':orderNumber')
  findOne(@Param('orderNumber') orderNumber: string) {
    return this.orderService.findByOrderNumber(orderNumber);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto.status);
  }
}
