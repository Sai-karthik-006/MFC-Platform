import { Controller, Get, Post, Patch, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { CateringService } from './catering.service';
import { CreateCateringRequestDto } from './dto/create-catering-request.dto';
import { UpdateCateringStatusDto } from './dto/update-catering-status.dto';

@Controller('catering')
export class CateringController {
  constructor(private readonly cateringService: CateringService) {}

  @Post()
  create(@Body() dto: CreateCateringRequestDto) {
    return this.cateringService.create(dto);
  }

  @Get()
  findAll() {
    return this.cateringService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cateringService.findById(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCateringStatusDto,
  ) {
    return this.cateringService.updateStatus(id, dto.status);
  }
}
