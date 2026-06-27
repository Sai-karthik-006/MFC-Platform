import { IsString, IsOptional, IsInt, IsArray, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class OrderItemInputDto {
  @IsString()
  productVariantId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @MaxLength(100)
  customerName: string;

  @IsString()
  @MaxLength(20)
  customerPhone: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  customerEmail?: string;

  @IsString()
  customerAddress: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  landmark?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];
}
