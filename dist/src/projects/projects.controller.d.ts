import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(user: {
        id: string;
    }, search?: string): Promise<{
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
    create(user: {
        id: string;
    }, dto: CreateProjectDto): Promise<{
        id: string;
        projectNumber: string;
        name: string;
        date: string;
        expenseCount: number;
        totalAmount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    findOne(id: string, user: {
        id: string;
    }): Promise<{
        id: string;
        projectNumber: string;
        name: string;
        date: string;
        expenseCount: number;
        totalAmount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    update(id: string, user: {
        id: string;
    }, dto: UpdateProjectDto): Promise<{
        id: string;
        projectNumber: string;
        name: string;
        date: string;
        expenseCount: number;
        totalAmount: number;
        createdAt: string;
        updatedAt: string;
    }>;
    remove(id: string, user: {
        id: string;
    }): Promise<{
        success: boolean;
    }>;
}
