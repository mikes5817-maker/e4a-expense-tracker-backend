import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class ReportService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    getReportPreview(projectId: string, userId: string): Promise<{
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
    sendReport(projectId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private generatePdf;
    private sendEmail;
    generateReportPdf(projectId: string, userId: string): Promise<{
        pdf: Buffer;
        filename: string;
    }>;
}
