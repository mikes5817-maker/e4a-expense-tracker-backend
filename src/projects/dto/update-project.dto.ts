import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'PRJ-002' })
  @IsString()
  @IsOptional()
  projectNumber?: string;

  @ApiPropertyOptional({ example: 'Updated Project Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '2025-07-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  date?: string;
}
