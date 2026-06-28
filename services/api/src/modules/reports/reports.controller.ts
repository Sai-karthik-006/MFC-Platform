import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { BaseReportResponse, DateRangeFilter } from './reports.response';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  getSalesReport(@Query() filter: DateRangeFilter): Promise<BaseReportResponse> {
    return this.reportsService.getSalesReport(filter);
  }

  @Get('orders')
  getOrdersReport(@Query() filter: DateRangeFilter): Promise<BaseReportResponse> {
    return this.reportsService.getOrdersReport(filter);
  }

  @Get('customers')
  getCustomersReport(@Query() filter: DateRangeFilter): Promise<BaseReportResponse> {
    return this.reportsService.getCustomersReport(filter);
  }

  @Get('products')
  getProductsReport(@Query() filter: DateRangeFilter): Promise<BaseReportResponse> {
    return this.reportsService.getProductsReport(filter);
  }

  @Get('catering')
  getCateringReport(@Query() filter: DateRangeFilter): Promise<BaseReportResponse> {
    return this.reportsService.getCateringReport(filter);
  }

  @Get('sales/csv')
  async getSalesCsv(@Res() res, @Query() filter: DateRangeFilter) {
    const csv = await this.reportsService.getSalesCsv(filter);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="sales-report-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  }

  @Get('orders/csv')
  async getOrdersCsv(@Res() res, @Query() filter: DateRangeFilter) {
    const csv = await this.reportsService.getOrdersCsv(filter);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="orders-report-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  }

  @Get('customers/csv')
  async getCustomersCsv(@Res() res, @Query() filter: DateRangeFilter) {
    const csv = await this.reportsService.getCustomersCsv(filter);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="customers-report-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  }

  @Get('products/csv')
  async getProductsCsv(@Res() res, @Query() filter: DateRangeFilter) {
    const csv = await this.reportsService.getProductsCsv(filter);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="products-report-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  }

  @Get('catering/csv')
  async getCateringCsv(@Res() res, @Query() filter: DateRangeFilter) {
    const csv = await this.reportsService.getCateringCsv(filter);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="catering-report-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  }
}
