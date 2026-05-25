import { UploadService } from './upload.service';
import { PresignedUploadDto } from './dto/presigned.dto';
import { CompleteUploadDto } from './dto/complete-upload.dto';
import { InitiateMultipartDto, MultipartPartDto, CompleteMultipartDto } from './dto/multipart.dto';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    presigned(dto: PresignedUploadDto): Promise<{
        uploadUrl: string;
        cloud_storage_path: string;
    }>;
    complete(user: {
        id: string;
    }, dto: CompleteUploadDto): Promise<{
        id: string;
        cloud_storage_path: string;
    }>;
    initiateMultipart(dto: InitiateMultipartDto): Promise<{
        uploadId: string;
        cloud_storage_path: string;
    }>;
    getPartUrl(dto: MultipartPartDto): Promise<{
        url: string;
    }>;
    completeMultipart(dto: CompleteMultipartDto): Promise<{
        success: boolean;
        cloud_storage_path: string;
    }>;
    getFileUrl(id: string, user: {
        id: string;
    }, mode?: 'view' | 'download'): Promise<{
        url: string;
    }>;
    deleteFile(id: string, user: {
        id: string;
    }): Promise<{
        success: boolean;
    }>;
}
