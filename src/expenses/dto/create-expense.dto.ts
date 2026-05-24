import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export enum ExpenseCategoryDto {
  GasolinaDiesel = 'GasolinaDiesel',
  Hotel = 'Hotel',
  Herramientas = 'Herramientas',
  Material = 'Material',
  Other = 'Other',
}

export class CreateExpenseDto {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  employeeName: string;

  @ApiProperty({ example: '2025-06-15T00:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: ExpenseCategoryDto, example: 'GasolinaDiesel' })
  @IsEnum(ExpenseCategoryDto)
  category: ExpenseCategoryDto;

  @ApiPropertyOptional({ description: 'Custom category description when category is Other', example: 'Parking fees' })
  @IsString()
  @IsOptional()
  customCategory?: string;

  @ApiProperty({ example: 125.50 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'UUID of uploaded receipt file' })
  @IsUUID()
  @IsOptional()
  receiptFileId?: string;
}