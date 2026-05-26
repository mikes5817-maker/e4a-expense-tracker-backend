import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeReportDto } from './dto/create-time-report.dto';
export declare class TimeReportService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(dto: CreateTimeReportDto, userId: string): Promise<{
        employees: ({
            days: ({
                shifts: {
                    id: string;
                    projectId: string | null;
                    timeIn: number | null;
                    timeOut: number | null;
                    shiftNum: number;
                    timeDayId: string;
                }[];
            } & {
                id: string;
                date: Date;
                dayName: string;
                perDiem: boolean;
                timeEmployeeId: string;
            })[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            employeeId: string | null;
            timeReportId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        weekStart: Date;
    }>;
    findAll(userId: string): Promise<({
        employees: {
            name: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        weekStart: Date;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        employees: ({
            days: ({
                shifts: {
                    id: string;
                    projectId: string | null;
                    timeIn: number | null;
                    timeOut: number | null;
                    shiftNum: number;
                    timeDayId: string;
                }[];
            } & {
                id: string;
                date: Date;
                dayName: string;
                perDiem: boolean;
                timeEmployeeId: string;
            })[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            employeeId: string | null;
            timeReportId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        weekStart: Date;
    }>;
    downloadPdf(id: string, userId: string): Promise<{
        pdf: Buffer;
        filename: string;
    }>;
    private generatePdf;
}
