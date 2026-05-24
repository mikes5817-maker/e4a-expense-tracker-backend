import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class InitiateMultipartDto {
  @ApiProperty({ example: 'large-receipt.pdf' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class MultipartPartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cloud_storage_path: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uploadId: string;

  @ApiProperty()
  @IsNumber()
  partNumber: number;
}

export class PartInfo {
  @ApiProperty()
  @IsString()
  ETag: string;

  @ApiProperty()
  @IsNumber()
  PartNumber: number;
}

export class CompleteMultipartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cloud_storage_path: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uploadId: string;

  @ApiProperty({ type: [PartInfo] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartInfo)
  parts: PartInfo[];
}
