import { Controller, Get, Post, Patch, Delete, Body, Param, UseFilters, UsePipes, ValidationPipe, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';

@Controller('products')
@UseFilters(HttpExceptionFilter)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAllActive();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.softDelete(id);
  }
}
