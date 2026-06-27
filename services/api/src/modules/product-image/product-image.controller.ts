import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Controller('products/:productId/images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Get()
  findByProductId(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productImageService.findByProductId(productId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productImageService.findById(id);
  }

  @Post()
  create(@Param('productId', ParseUUIDPipe) productId: string, @Body() dto: CreateProductImageDto) {
    return this.productImageService.create(productId, dto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductImageDto) {
    return this.productImageService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productImageService.remove(id);
  }
}
