import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthResponse } from './health.response';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): Promise<HealthResponse> {
    return this.healthService.check();
  }
}
