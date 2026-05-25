"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const s3Lib = __importStar(require("../lib/s3"));
const nodemailer = __importStar(require("nodemailer"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const PDFDocument = require('pdfkit');
const CATEGORY_LABELS = {
    GasolinaDiesel: 'Gasolina/Diesel',
    Hotel: 'Hotel',
    Herramientas: 'Herramientas',
    Material: 'Material',
    Other: 'Otro',
};
function getCategoryLabel(category, customCategory) {
    if (category === 'Other' && customCategory)
        return customCategory;
    return CATEGORY_LABELS[category] ?? category;
}
let ReportService = ReportService_1 = class ReportService {
    prisma;
    configService;
    logger = new common_1.Logger(ReportService_1.name);
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async getReportPreview(projectId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { expenses: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.userId !== userId)
            throw new common_1.ForbiddenException();
        const expenses = project.expenses;
        const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const dates = expenses.map((e) => e.date.getTime());
        const earliest = dates.length ? new Date(Math.min(...dates)).toISOString() : null;
        const latest = dates.length ? new Date(Math.max(...dates)).toISOString() : null;
        const categoryMap = new Map();
        for (const e of expenses) {
            const label = getCategoryLabel(e.category, e.customCategory);
            const existing = categoryMap.get(label) || { subtotal: 0, count: 0 };
            existing.subtotal += Number(e.amount);
            existing.count++;
            categoryMap.set(label, existing);
        }
        const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
            category,
            subtotal: data.subtotal,
            count: data.count,
        }));
        return {
            projectId: project.id,
            projectNumber: project.projectNumber,
            projectName: project.name,
            projectDate: project.date.toISOString(),
            expenseCount: expenses.length,
            totalAmount,
            dateRange: { earliest, latest },
            categoryBreakdown,
        };
    }
    async sendReport(projectId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                expenses: {
                    include: { receiptFile: true },
                    orderBy: { date: 'asc' },
                },
            },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        if (project.userId !== userId)
            throw new common_1.ForbiddenException();
        const pdfBuffer = await this.generatePdf(project);
        await this.sendEmail(project.name, pdfBuffer);
        return {
            success: true,
            message: 'Report sent successfully to asantoro@e4asolutions.com',
        };
    }
    async generatePdf(project) {
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50, size: 'A4' });
                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);
                const BLUE = '#0077B6';
                const GRAY = '#666666';
                const LIGHT_GRAY = '#F0F0F0';
                const possiblePaths = [
                    path.resolve(__dirname, '..', 'assets', 'logo.png'),
                    path.resolve(__dirname, '..', '..', 'assets', 'logo.png'),
                    path.resolve(process.cwd(), 'src', 'assets', 'logo.png'),
                    path.resolve(process.cwd(), 'dist', 'assets', 'logo.png'),
                ];
                let resolvedLogoPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];
                if (fs.existsSync(resolvedLogoPath)) {
                    doc.image(resolvedLogoPath, 50, 30, { width: 120 });
                    doc.moveDown(4);
                }
                doc.fontSize(20).fillColor(BLUE).text('Expense Report', { align: 'center' });
                doc.moveDown(0.5);
                doc.fontSize(11).fillColor(GRAY);
                doc.text(`Project Number: ${project.projectNumber}`);
                doc.text(`Project Name: ${project.name}`);
                doc.text(`Date: ${new Date(project.date).toLocaleDateString('en-US')}`);
                doc.moveDown(1);
                doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(BLUE).lineWidth(1).stroke();
                doc.moveDown(0.5);
                const tableTop = doc.y;
                const colWidths = [130, 90, 110, 90];
                const colX = [50, 180, 270, 380];
                doc.rect(50, tableTop, 495, 20).fill(BLUE);
                doc.fontSize(10).fillColor('#FFFFFF');
                doc.text('Employee', colX[0] + 5, tableTop + 5, { width: colWidths[0] });
                doc.text('Date', colX[1] + 5, tableTop + 5, { width: colWidths[1] });
                doc.text('Category', colX[2] + 5, tableTop + 5, { width: colWidths[2] });
                doc.text('Amount', colX[3] + 5, tableTop + 5, { width: colWidths[3], align: 'right' });
                let y = tableTop + 22;
                let totalAmount = 0;
                for (let i = 0; i < project.expenses.length; i++) {
                    const expense = project.expenses[i];
                    totalAmount += Number(expense.amount);
                    if (y > 720) {
                        doc.addPage();
                        y = 50;
                    }
                    if (i % 2 === 0) {
                        doc.rect(50, y, 495, 18).fill(LIGHT_GRAY);
                    }
                    doc.fontSize(9).fillColor('#333333');
                    doc.text(expense.employeeName, colX[0] + 5, y + 4, { width: colWidths[0] });
                    doc.text(new Date(expense.date).toLocaleDateString('en-US'), colX[1] + 5, y + 4, { width: colWidths[1] });
                    doc.text(getCategoryLabel(expense.category, expense.customCategory), colX[2] + 5, y + 4, { width: colWidths[2] });
                    doc.text(`$${Number(expense.amount).toFixed(2)}`, colX[3] + 5, y + 4, { width: colWidths[3] - 10, align: 'right' });
                    y += 18;
                }
                doc.rect(50, y, 495, 22).fill(BLUE);
                doc.fontSize(10).fillColor('#FFFFFF');
                doc.text('TOTAL', colX[0] + 5, y + 6, { width: 300 });
                doc.text(`$${totalAmount.toFixed(2)}`, colX[3] + 5, y + 6, { width: colWidths[3] - 10, align: 'right' });
                y += 30;
                const expensesWithReceipts = project.expenses.filter((e) => e.receiptFile && (e.receiptFile.contentType.startsWith('image/')));
                if (expensesWithReceipts.length > 0) {
                    if (y > 650) {
                        doc.addPage();
                        y = 50;
                    }
                    doc.moveDown(1);
                    doc.fontSize(14).fillColor(BLUE).text('Receipt Images', 50, y);
                    y += 25;
                    for (const expense of expensesWithReceipts) {
                        try {
                            const imageBuffer = await s3Lib.getFileBuffer(expense.receiptFile.cloud_storage_path);
                            if (y > 500) {
                                doc.addPage();
                                y = 50;
                            }
                            doc.fontSize(9).fillColor(GRAY).text(`${expense.employeeName} - ${getCategoryLabel(expense.category, expense.customCategory)} - $${Number(expense.amount).toFixed(2)}`, 50, y);
                            y += 15;
                            doc.image(imageBuffer, 50, y, { width: 250, fit: [250, 200] });
                            y += 210;
                        }
                        catch (err) {
                            this.logger.error(`Failed to embed receipt image for expense ${expense.id}`, err);
                            doc.fontSize(9).fillColor('#CC0000').text(`[Could not load receipt: ${expense.receiptFile.fileName}]`, 50, y);
                            y += 15;
                        }
                    }
                }
                const pdfReceipts = project.expenses.filter((e) => e.receiptFile && e.receiptFile.contentType === 'application/pdf');
                if (pdfReceipts.length > 0) {
                    if (y > 700) {
                        doc.addPage();
                        y = 50;
                    }
                    doc.moveDown(1);
                    doc.fontSize(11).fillColor(BLUE).text('PDF Receipts (not embedded)', 50, y);
                    y += 18;
                    for (const expense of pdfReceipts) {
                        doc.fontSize(9).fillColor(GRAY).text(`• ${expense.employeeName} - ${expense.receiptFile.fileName}`, 60, y);
                        y += 14;
                    }
                }
                doc.fontSize(8).fillColor(GRAY).text(`Generated on ${new Date().toLocaleDateString('en-US')} | E4A Solutions`, 50, 770, { align: 'center', width: 495 });
                doc.end();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async sendEmail(projectName, pdfBuffer) {
        const transport = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: Number(this.configService.get('SMTP_PORT') || '587'),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
        await transport.sendMail({
            from: this.configService.get('SMTP_FROM') || 'noreply@e4asolutions.com',
            to: 'asantoro@e4asolutions.com',
            subject: `E4A Solutions - Expense Report: ${projectName}`,
            text: `Please find attached the expense report for project: ${projectName}.`,
            html: `<p>Please find attached the expense report for project: <strong>${projectName}</strong>.</p>`,
            attachments: [
                {
                    filename: `Expense_Report_${projectName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        });
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = ReportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ReportService);
//# sourceMappingURL=report.service.js.map