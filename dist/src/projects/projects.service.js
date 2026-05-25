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
var ProjectsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = ProjectsService_1 = class ProjectsService {
    prisma;
    logger = new common_1.Logger(ProjectsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, search) {
        const where = { userId };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { projectNumber: { contains: search, mode: 'insensitive' } },
            ];
        }
        const projects = await this.prisma.project.findMany({
            where,
            include: {
                expenses: { select: { amount: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            items: projects.map((p) => ({
                id: p.id,
                projectNumber: p.projectNumber,
                name: p.name,
                date: p.date.toISOString(),
                expenseCount: p.expenses.length,
                totalAmount: p.expenses.reduce((sum, e) => sum + Number(e.amount), 0),
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString(),
            })),
        };
    }
    async findOne(id, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                expenses: { select: { amount: true } },
            },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.userId !== userId)
            throw new common_1.ForbiddenException();
        return {
            id: project.id,
            projectNumber: project.projectNumber,
            name: project.name,
            date: project.date.toISOString(),
            expenseCount: project.expenses.length,
            totalAmount: project.expenses.reduce((sum, e) => sum + Number(e.amount), 0),
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
        };
    }
    async create(userId, dto) {
        const project = await this.prisma.project.create({
            data: {
                userId,
                projectNumber: dto.projectNumber,
                name: dto.name,
                date: new Date(dto.date),
            },
        });
        return {
            id: project.id,
            projectNumber: project.projectNumber,
            name: project.name,
            date: project.date.toISOString(),
            expenseCount: 0,
            totalAmount: 0,
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
        };
    }
    async update(id, userId, dto) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.userId !== userId)
            throw new common_1.ForbiddenException();
        const updated = await this.prisma.project.update({
            where: { id },
            data: {
                ...(dto.projectNumber !== undefined && { projectNumber: dto.projectNumber }),
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.date !== undefined && { date: new Date(dto.date) }),
            },
            include: { expenses: { select: { amount: true } } },
        });
        return {
            id: updated.id,
            projectNumber: updated.projectNumber,
            name: updated.name,
            date: updated.date.toISOString(),
            expenseCount: updated.expenses.length,
            totalAmount: updated.expenses.reduce((sum, e) => sum + Number(e.amount), 0),
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
        };
    }
    async remove(id, userId) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.project.delete({ where: { id } });
        return { success: true };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = ProjectsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map