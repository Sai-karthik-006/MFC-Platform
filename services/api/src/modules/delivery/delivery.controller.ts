import { Controller, Get, Patch, Param } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('orders')
  findAssignedOrders() {
    return this.deliveryService.findAssignedOrders();
  }

  @Patch('orders/:id/accept')
  acceptDelivery(@Param('id') id: string) {
    return this.deliveryService.acceptDelivery(id);
  }

  @Patch('orders/:id/reject')
  rejectDelivery(@Param('id') id: string) {
    return this.deliveryService.rejectDelivery(id);
  }

  @Patch('orders/:id/picked-up')
  markPickedUp(@Param('id') id: string) {
    return this.deliveryService.markPickedUp(id);
  }

  @Patch('orders/:id/delivered')
  markDelivered(@Param('id') id: string) {
    return this.deliveryService.markDelivered(id);
  }

  @Get('orders/:orderNumber')
  findOrderById(@Param('orderNumber') orderNumber: string) {
    return this.deliveryService.findOrderById(orderNumber);
  }
}