import { IsString, IsOptional, IsUrl, IsBoolean, MaxLength } from 'class-validator';

export class UpdateProductImageDto {
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

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
