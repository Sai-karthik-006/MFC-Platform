import { Controller, Get, Post, Patch, Delete, Body, Param, UseInterceptors, UseFilters, UsePipes, ValidationPipe, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';

@Controller('categories')
@UseInterceptors(TransformInterceptor)
@UseFilters(HttpExceptionFilter)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAllActive();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.softDelete(id);
  }
}
