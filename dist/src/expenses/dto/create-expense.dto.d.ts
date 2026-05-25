export declare enum ExpenseCategoryDto {
    GasolinaDiesel = "GasolinaDiesel",
    Hotel = "Hotel",
    Herramientas = "Herramientas",
    Material = "Material",
    Other = "Other"
}
export declare class CreateExpenseDto {
    employeeName: string;
    date: string;
    category: ExpenseCategoryDto;
    customCategory?: string;
    amount: number;
    receiptFileId?: string;
}
