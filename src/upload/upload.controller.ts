import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadService } from './upload.service';
import { PresignedUploadDto } from './dto/presigned.dto';
import { CompleteUploadDto } from './dto/complete-upload.dto';
import { InitiateMultipartDto, MultipartPartDto, CompleteMultipartDto } from './dto/multipart.dto';

@ApiTags('Files')
@Controller('api')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload/presigned')
  @ApiOperation({ summary: 'Get presigned URL for single-part upload' })
  presigned(@Body() dto: PresignedUploadDto) {
    return this.uploadService.getPresignedUrl(dto.fileName, dto.contentType, dto.isPublic);
  }

  @Post('upload/complete')
  @ApiOperation({ summary: 'Confirm file upload and save metadata' })
  complete(
    @CurrentUser() user: { id: string },
    @Body() dto: CompleteUploadDto,
  ) {
    return this.uploadService.completeUpload(
      user.id,
      dto.cloud_storage_path,
      dto.fileName,
      dto.contentType,
      dto.fileSize,
    );
  }

  @Post('upload/multipart/initiate')
  @ApiOperation({ summary: 'Initiate multipart upload' })
  initiateMultipart(@Body() dto: InitiateMultipartDto) {
    return this.uploadService.initiateMultipart(dto.fileName, dto.isPublic ?? false);
  }

  @Post('upload/multipart/part')
  @ApiOperation({ summary: 'Get presigned URL for a part' })
  getPartUrl(@Body() dto: MultipartPartDto) {
    return this.uploadService.getPartUrl(dto.cloud_storage_path, dto.uploadId, dto.partNumber);
  }

  @Post('upload/multipart/complete')
  @ApiOperation({ summary: 'Complete multipart upload' })
  completeMultipart(@Body() dto: CompleteMultipartDto) {
    return this.uploadService.completeMultipart(dto.cloud_storage_path, dto.uploadId, dto.parts);
  }

  @Get('files/:id/url')
  @ApiOperation({ summary: 'Get file URL (view or download)' })
  @ApiQuery({ name: 'mode', enum: ['view', 'download'], required: false })
  getFileUrl(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Query('mode') mode?: 'view' | 'download',
  ) {
    return this.uploadService.getFileUrl(id, user.id, mode || 'view');
  }

  @Delete('files/:id')
  @ApiOperation({ summary: 'Delete a file' })
  deleteFile(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.uploadService.deleteFile(id, user.id);
  }
}
