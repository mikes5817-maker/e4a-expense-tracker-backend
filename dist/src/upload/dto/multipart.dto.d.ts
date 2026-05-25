export declare class InitiateMultipartDto {
    fileName: string;
    isPublic?: boolean;
}
export declare class MultipartPartDto {
    cloud_storage_path: string;
    uploadId: string;
    partNumber: number;
}
export declare class PartInfo {
    ETag: string;
    PartNumber: number;
}
export declare class CompleteMultipartDto {
    cloud_storage_path: string;
    uploadId: string;
    parts: PartInfo[];
}
