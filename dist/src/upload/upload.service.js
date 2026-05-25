"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const s3Lib = __importStar(require("../lib/s3"));
let UploadService = UploadService_1 = class UploadService {
    prisma;
    logger = new common_1.Logger(UploadService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPresignedUrl(fileName, contentType, isPublic) {
        const result = await s3Lib.generatePresignedUploadUrl(fileName, contentType, isPublic);
        return result;
    }
    async completeUpload(userId, cloud_storage_path, fileName, contentType, fileSize) {
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
    async getFileUrl(fileId, userId, mode = 'view') {
        const file = await this.prisma.file.findUnique({ where: { id: fileId } });
        if (!file)
            throw new common_1.NotFoundException('File not found');
        if (file.userId !== userId)
            throw new common_1.ForbiddenException();
        const url = mode === 'download'
            ? await s3Lib.getFileUrl(file.cloud_storage_path, file.isPublic)
            : await s3Lib.getFileViewUrl(file.cloud_storage_path, file.isPublic);
        return { url };
    }
    async deleteFile(fileId, userId) {
        const file = await this.prisma.file.findUnique({ where: { id: fileId } });
        if (!file)
            throw new common_1.NotFoundException('File not found');
        if (file.userId !== userId)
            throw new common_1.ForbiddenException();
        await s3Lib.deleteFile(file.cloud_storage_path);
        await this.prisma.file.delete({ where: { id: fileId } });
        return { success: true };
    }
    async initiateMultipart(fileName, isPublic) {
        return s3Lib.initiateMultipartUpload(fileName, isPublic);
    }
    async getPartUrl(cloud_storage_path, uploadId, partNumber) {
        const url = await s3Lib.getPresignedUrlForPart(cloud_storage_path, uploadId, partNumber);
        return { url };
    }
    async completeMultipart(cloud_storage_path, uploadId, parts) {
        await s3Lib.completeMultipartUpload(cloud_storage_path, uploadId, parts);
        return { success: true, cloud_storage_path };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map