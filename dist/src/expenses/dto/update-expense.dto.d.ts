import { ExpenseCategoryDto } from './create-expense.dto';
export declare class UpdateExpenseDto {
    employeeName?: string;
    date?: string;
    category?: ExpenseCategoryDto;
    customCategory?: string;
    amount?: number;
    receiptFileId?: string | null;
}
