import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, search?: string) {
    const where: Prisma.ProjectWhereInput = { userId };
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

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        expenses: { select: { amount: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();

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

  async create(userId: string, dto: CreateProjectDto) {
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

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();

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

  async remove(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();

    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }
}
