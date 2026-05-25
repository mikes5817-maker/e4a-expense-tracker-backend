import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(userId: string, search?: string): Promise<{
        items: {
            id: string;
            projectNumber: string;
            name: string;
            date: string;
            expenseCount: number;
            totalAmount: number;
            createdAt: string;
            updatedAt: string;
        }[];
    }>;
    findOne(id: string, userId: string): Promise<{
        id: string;
        projectNumber: string;
        name: string;
        date: string;
        expenseCount: number;
        totalAmount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    create(userId: string, dto: CreateProjectDto): Promise<{
        id: string;
        projectNumber: string;
        name: string;
        date: string;
        expenseCount: number;
        totalAmount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, userId: string, dto: UpdateProjectDto): Promise<{
        id: string;
        projectNumber: string;
        name: string;
        date: string;
        expenseCount: number;
        totalAmount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
