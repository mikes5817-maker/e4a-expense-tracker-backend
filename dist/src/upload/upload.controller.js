"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const upload_service_1 = require("./upload.service");
const presigned_dto_1 = require("./dto/presigned.dto");
const complete_upload_dto_1 = require("./dto/complete-upload.dto");
const multipart_dto_1 = require("./dto/multipart.dto");
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    presigned(dto) {
        return this.uploadService.getPresignedUrl(dto.fileName, dto.contentType, dto.isPublic);
    }
    complete(user, dto) {
        return this.uploadService.completeUpload(user.id, dto.cloud_storage_path, dto.fileName, dto.contentType, dto.fileSize);
    }
    initiateMultipart(dto) {
        return this.uploadService.initiateMultipart(dto.fileName, dto.isPublic ?? false);
    }
    getPartUrl(dto) {
        return this.uploadService.getPartUrl(dto.cloud_storage_path, dto.uploadId, dto.partNumber);
    }
    completeMultipart(dto) {
        return this.uploadService.completeMultipart(dto.cloud_storage_path, dto.uploadId, dto.parts);
    }
    getFileUrl(id, user, mode) {
        return this.uploadService.getFileUrl(id, user.id, mode || 'view');
    }
    deleteFile(id, user) {
        return this.uploadService.deleteFile(id, user.id);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('upload/presigned'),
    (0, swagger_1.ApiOperation)({ summary: 'Get presigned URL for single-part upload' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [presigned_dto_1.PresignedUploadDto]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "presigned", null);
__decorate([
    (0, common_1.Post)('upload/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm file upload and save metadata' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, complete_upload_dto_1.CompleteUploadDto]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "complete", null);
__decorate([
    (0, common_1.Post)('upload/multipart/initiate'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate multipart upload' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [multipart_dto_1.InitiateMultipartDto]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "initiateMultipart", null);
__decorate([
    (0, common_1.Post)('upload/multipart/part'),
    (0, swagger_1.ApiOperation)({ summary: 'Get presigned URL for a part' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [multipart_dto_1.MultipartPartDto]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "getPartUrl", null);
__decorate([
    (0, common_1.Post)('upload/multipart/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete multipart upload' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [multipart_dto_1.CompleteMultipartDto]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "completeMultipart", null);
__decorate([
    (0, common_1.Get)('files/:id/url'),
    (0, swagger_1.ApiOperation)({ summary: 'Get file URL (view or download)' }),
    (0, swagger_1.ApiQuery)({ name: 'mode', enum: ['view', 'download'], required: false }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "getFileUrl", null);
__decorate([
    (0, common_1.Delete)('files/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a file' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "deleteFile", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Files'),
    (0, common_1.Controller)('api'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map