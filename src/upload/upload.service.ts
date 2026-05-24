import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as s3Lib from '../lib/s3';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getPresignedUrl(fileName: string, contentType: string, isPublic: boolean) {
    const result = await s3Lib.generatePresignedUploadUrl(fileName, contentType, isPublic);
    return result;
  }

  async completeUpload(
    userId: string,
    cloud_storage_path: string,
    fileName: string,
    contentType: string,
    fileSize?: number,
  ) {
    const file = await this.prisma.file.create({
      data: {
        userId,
        fileName,
        cloud_storage_path,
        contentType,
        fileSize: fileSize ?? null,
        isPublic: cloud_storage_path.includes('/public/'),
      },
    });
    return { id: file.id, cloud_storage_path: file.cloud_storage_path };
  }

  async getFileUrl(fileId: string, userId: string, mode: 'view' | 'download' = 'view') {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) throw new NotFoundException('File not found');
    if (file.userId !== userId) throw new ForbiddenException();

    const url = mode === 'download'
      ? await s3Lib.getFileUrl(file.cloud_storage_path, file.isPublic)
      : await s3Lib.getFileViewUrl(file.cloud_storage_path, file.isPublic);
    return { url };
  }

  async deleteFile(fileId: string, userId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) throw new NotFoundException('File not found');
    if (file.userId !== userId) throw new ForbiddenException();

    await s3Lib.deleteFile(file.cloud_storage_path);
    await this.prisma.file.delete({ where: { id: fileId } });
    return { success: true };
  }

  async initiateMultipart(fileName: string, isPublic: boolean) {
    return s3Lib.initiateMultipartUpload(fileName, isPublic);
  }

  async getPartUrl(cloud_storage_path: string, uploadId: string, partNumber: number) {
    const url = await s3Lib.getPresignedUrlForPart(cloud_storage_path, uploadId, partNumber);
    return { url };
  }

  async completeMultipart(
    cloud_storage_path: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
  ) {
    await s3Lib.completeMultipartUpload(cloud_storage_path, uploadId, parts);
    return { success: true, cloud_storage_path };
  }
}
