import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { CateringService } from './catering.service';
import { CateringController } from './catering.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CateringController],
  providers: [CateringService],
  exports: [CateringService],
})
export class CateringModule {}
