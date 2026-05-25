import { ReportService } from './report.service';
import { Response } from 'express';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    preview(projectId: string, user: {
        id: string;
    }): Promise<{
        projectId: string;
        projectNumber: string;
        projectName: string;
        projectDate: string;
        expenseCount: number;
        totalAmount: number;
        dateRange: {
            earliest: string | null;
            latest: string | null;
        };
        categoryBreakdown: {
            category: string;
            subtotal: number;
            count: number;
        }[];
    }>;
    download(projectId: string, user: {
        id: string;
    }, res: Response): Promise<void>;
    send(projectId: string, user: {
        id: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
