import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DateRangeFilter } from './analytics.response';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAnalytics(@Query() filter: DateRangeFilter) {
    return this.analyticsService.getAnalytics(filter);
  }
}
