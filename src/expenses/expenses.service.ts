import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseCategory } from '@prisma/client';
import * as s3Lib from '../lib/s3';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async formatExpense(expense: any) {
    let receiptUrl: string | null = null;
    let receiptFileName: string | null = null;
    let receiptContentType: string | null = null;

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

  async findAllForProject(projectId: string, userId: string) {
    // Verify project belongs to user
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();

    const expenses = await this.prisma.expense.findMany({
      where: { projectId },
      include: { receiptFile: true },
      orderBy: { date: 'desc' },
    });

    const items = await Promise.all(expenses.map((e) => this.formatExpense(e)));
    return { items };
  }

  async findOne(id: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: { receiptFile: true },
    });
    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.userId !== userId) throw new ForbiddenException();

    return this.formatExpense(expense);
  }

  async create(projectId: string, userId: string, dto: CreateExpenseDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException();

    const expense = await this.prisma.expense.create({
      data: {
        projectId,
        userId,
        employeeName: dto.employeeName,
        date: new Date(dto.date),
        category: dto.category as ExpenseCategory,
        customCategory: dto.customCategory ?? null,
        amount: dto.amount,
        receiptFileId: dto.receiptFileId ?? null,
      },
      include: { receiptFile: true },
    });

    return this.formatExpense(expense);
  }

  async update(id: string, userId: string, dto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.userId !== userId) throw new ForbiddenException();

    const data: any = {};
    if (dto.employeeName !== undefined) data.employeeName = dto.employeeName;
    if (dto.date !== undefined) data.date = new Date(dto.date);
    if (dto.category !== undefined) data.category = dto.category as ExpenseCategory;
    if (dto.customCategory !== undefined) data.customCategory = dto.customCategory;
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.receiptFileId !== undefined) data.receiptFileId = dto.receiptFileId;

    const updated = await this.prisma.expense.update({
      where: { id },
      data,
      include: { receiptFile: true },
    });

    return this.formatExpense(updated);
  }

  async remove(id: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.userId !== userId) throw new ForbiddenException();

    await this.prisma.expense.delete({ where: { id } });
    return { success: true };
  }
}
