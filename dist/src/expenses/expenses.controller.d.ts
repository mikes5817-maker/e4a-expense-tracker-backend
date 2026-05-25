import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(projectId: string, user: {
        id: string;
    }): Promise<{
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
    create(projectId: string, user: {
        id: string;
    }, dto: CreateExpenseDto): Promise<{
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
    findOne(id: string, user: {
        id: string;
    }): Promise<{
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
    update(id: string, user: {
        id: string;
    }, dto: UpdateExpenseDto): Promise<{
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
    remove(id: string, user: {
        id: string;
    }): Promise<{
        success: boolean;
    }>;
}
