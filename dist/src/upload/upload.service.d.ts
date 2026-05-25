import { PrismaService } from '../prisma/prisma.service';
export declare class UploadService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getPresignedUrl(fileName: string, contentType: string, isPublic: boolean): Promise<{
        uploadUrl: string;
        cloud_storage_path: string;
    }>;
    completeUpload(userId: string, cloud_storage_path: string, fileName: string, contentType: string, fileSize?: number): Promise<{
        id: string;
        cloud_storage_path: string;
    }>;
    getFileUrl(fileId: string, userId: string, mode?: 'view' | 'download'): Promise<{
        url: string;
    }>;
    deleteFile(fileId: string, userId: string): Promise<{
        success: boolean;
    }>;
    initiateMultipart(fileName: string, isPublic: boolean): Promise<{
        uploadId: string;
        cloud_storage_path: string;
    }>;
    getPartUrl(cloud_storage_path: string, uploadId: string, partNumber: number): Promise<{
        url: string;
    }>;
    completeMultipart(cloud_storage_path: string, uploadId: string, parts: {
        ETag: string;
        PartNumber: number;
    }[]): Promise<{
        success: boolean;
        cloud_storage_path: string;
    }>;
}
