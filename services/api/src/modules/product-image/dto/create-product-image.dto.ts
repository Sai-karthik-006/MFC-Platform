import { IsString, IsOptional, IsBoolean, IsUrl, MaxLength } from 'class-validator';

export class CreateProductImageDto {
  @IsUrl()
  @MaxLength(500)
  imageUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  sortOrder?: string;
}
