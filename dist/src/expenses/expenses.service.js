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
var ExpensesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const s3Lib = __importStar(require("../lib/s3"));
let ExpensesService = ExpensesService_1 = class ExpensesService {
    prisma;
    logger = new common_1.Logger(ExpensesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async formatExpense(expense) {
        let receiptUrl = null;
        let receiptFileName = null;
        let receiptContentType = null;
        if (expense.receiptFile) {
            receiptUrl = await s3Lib.getFileViewUrl(expense.receiptFile.cloud_storage_path, expense.receiptFile.isPublic);
            receiptFileName = expense.receiptFile.fileName;
            receiptContentType = expense.receiptFile.contentType;
        }
        return {
            id: expense.id,
            projectId: expense.projectId,
            employeeName: expense.employeeName,
            date: expense.date.toISOString(),
            category: expense.category,
            customCategory: expense.customCategory ?? null,
            amount: Number(expense.amount),
            receiptFileId: expense.receiptFileId,
            receiptUrl,
            receiptFileName,
            receiptContentType,
            createdAt: expense.createdAt.toISOString(),
            updatedAt: expense.updatedAt.toISOString(),
        };
    }
    async findAllForProject(projectId, userId) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.userId !== userId)
            throw new common_1.ForbiddenException();
        const expenses = await this.prisma.expense.findMany({
            where: { projectId },
            include: { receiptFile: true },
            orderBy: { date: 'desc' },
        });
        const items = await Promise.all(expenses.map((e) => this.formatExpense(e)));
        return { items };
    }
    async findOne(id, userId) {
        const expense = await this.prisma.expense.findUnique({
            where: { id },
            include: { receiptFile: true },
        });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        if (expense.userId !== userId)
            throw new common_1.ForbiddenException();
        return this.formatExpense(expense);
    }
    async create(projectId, userId, dto) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.userId !== userId)
            throw new common_1.ForbiddenException();
        const expense = await this.prisma.expense.create({
            data: {
                projectId,
                userId,
                employeeName: dto.employeeName,
                date: new Date(dto.date),
                category: dto.category,
                customCategory: dto.customCategory ?? null,
                amount: dto.amount,
                receiptFileId: dto.receiptFileId ?? null,
            },
            include: { receiptFile: true },
        });
        return this.formatExpense(expense);
    }
    async update(id, userId, dto) {
        const expense = await this.prisma.expense.findUnique({ where: { id } });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        if (expense.userId !== userId)
            throw new common_1.ForbiddenException();
        const data = {};
        if (dto.employeeName !== undefined)
            data.employeeName = dto.employeeName;
        if (dto.date !== undefined)
            data.date = new Date(dto.date);
        if (dto.category !== undefined)
            data.category = dto.category;
        if (dto.customCategory !== undefined)
            data.customCategory = dto.customCategory;
        if (dto.amount !== undefined)
            data.amount = dto.amount;
        if (dto.receiptFileId !== undefined)
            data.receiptFileId = dto.receiptFileId;
        const updated = await this.prisma.expense.update({
            where: { id },
            data,
            include: { receiptFile: true },
        });
        return this.formatExpense(updated);
    }
    async remove(id, userId) {
        const expense = await this.prisma.expense.findUnique({ where: { id } });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        if (expense.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.expense.delete({ where: { id } });
        return { success: true };
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = ExpensesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map