import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CompleteUploadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cloud_storage_path: string;

  @ApiProperty({ example: 'receipt.jpg' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  fileSize?: number;
}
