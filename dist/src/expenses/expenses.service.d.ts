import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private formatExpense;
    findAllForProject(projectId: string, userId: string): Promise<{
        items: {
            id: any;
            projectId: any;
            employeeName: any;
            date: any;
            category: any;
            customCategory: any;
            amount: number;
            receiptFileId: any;
            receiptUrl: string | null;
            receiptFileName: string | null;
            receiptContentType: string | null;
            createdAt: any;
            updatedAt: any;
        }[];
    }>;
    findOne(id: string, userId: string): Promise<{
        id: any;
        projectId: any;
        employeeName: any;
        date: any;
        category: any;
        customCategory: any;
        amount: number;
        receiptFileId: any;
        receiptUrl: string | null;
        receiptFileName: string | null;
        receiptContentType: string | null;
        createdAt: any;
        updatedAt: any;
    }>;
    create(projectId: string, userId: string, dto: CreateExpenseDto): Promise<{
        id: any;
        projectId: any;
        employeeName: any;
        date: any;
        category: any;
        customCategory: any;
        amount: number;
        receiptFileId: any;
        receiptUrl: string | null;
        receiptFileName: string | null;
        receiptContentType: string | null;
        createdAt: any;
        updatedAt: any;
    }>;
    update(id: string, userId: string, dto: UpdateExpenseDto): Promise<{
        id: any;
        projectId: any;
        employeeName: any;
        date: any;
        category: any;
        customCategory: any;
        amount: number;
        receiptFileId: any;
        receiptUrl: string | null;
        receiptFileName: string | null;
        receiptContentType: string | null;
        createdAt: any;
        updatedAt: any;
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
