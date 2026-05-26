import { TimeReportService } from './time-report.service';
import { CreateTimeReportDto } from './dto/create-time-report.dto';
import type { Response } from 'express';
export declare class TimeReportController {
    private readonly timeReportService;
    constructor(timeReportService: TimeReportService);
    create(dto: CreateTimeReportDto, user: {
        id: string;
    }): Promise<{
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
    findAll(user: {
        id: string;
    }): Promise<({
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
    findOne(id: string, user: {
        id: string;
    }): Promise<{
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
    download(id: string, user: {
        id: string;
    }, res: Response): Promise<void>;
}
