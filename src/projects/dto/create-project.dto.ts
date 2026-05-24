import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'PRJ-001' })
  @IsString()
  @IsNotEmpty()
  projectNumber: string;

  @ApiProperty({ example: 'Office Renovation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2025-06-01T00:00:00.000Z' })
  @IsDateString()
  date: string;
}
