import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProductImageController],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}
