import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
