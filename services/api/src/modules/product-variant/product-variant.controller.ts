import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Controller('products/:productId/variants')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Get()
  findByProductId(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productVariantService.findByProductId(productId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productVariantService.findById(id);
  }

  @Post()
  create(@Param('productId', ParseUUIDPipe) productId: string, @Body() dto: CreateProductVariantDto) {
    return this.productVariantService.create(productId, dto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductVariantDto) {
    return this.productVariantService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productVariantService.softDelete(id);
  }
}
