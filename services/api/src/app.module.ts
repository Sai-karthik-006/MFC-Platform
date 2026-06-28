import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './database/prisma.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ProductVariantModule } from './modules/product-variant/product-variant.module';
import { ProductImageModule } from './modules/product-image/product-image.module';
import { OrderModule } from './modules/order/order.module';
import { CateringModule } from './modules/catering/catering.module';
import { HealthModule } from './modules/health/health.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DeliveryModule } from './modules/delivery/delivery.module';

import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    CategoryModule,
    ProductModule,
    ProductVariantModule,
    ProductImageModule,
    OrderModule,
    CateringModule,
    HealthModule,
    AnalyticsModule,
    DeliveryModule,
    AuthModule,
  ],
})
export class AppModule {}
