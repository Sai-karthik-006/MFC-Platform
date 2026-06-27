import { IsIn } from 'class-validator';

export class UpdateCateringStatusDto {
  @IsIn(['PENDING', 'CONFIRMED', 'CANCELLED'])
  status: string;
}