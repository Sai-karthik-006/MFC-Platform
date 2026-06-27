import { IsString, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreateCateringRequestDto {
  @IsString()
  @MaxLength(100)
  customerName: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @IsString()
  @MaxLength(100)
  eventType: string;

  @IsString()
  eventDate: string;

  @IsInt()
  @Min(1)
  guestCount: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
