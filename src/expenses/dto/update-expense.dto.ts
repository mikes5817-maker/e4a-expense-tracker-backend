import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';
import { ExpenseCategoryDto } from './create-expense.dto';

export class UpdateExpenseDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsString()
  @IsOptional()
  employeeName?: string;

  @ApiPropertyOptional({ example: '2025-07-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ enum: ExpenseCategoryDto })
  @IsEnum(ExpenseCategoryDto)
  @IsOptional()
  category?: ExpenseCategoryDto;

  @ApiPropertyOptional({ description: 'Custom category description when category is Other' })
  @IsString()
  @IsOptional()
  customCategory?: string;

  @ApiPropertyOptional({ example: 200.00 })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ description: 'UUID of receipt file, or null to remove', nullable: true })
  @ValidateIf((o) => o.receiptFileId !== null)
  @IsUUID()
  @IsOptional()
  receiptFileId?: string | null;
}