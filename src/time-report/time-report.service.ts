import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeReportDto } from './dto/create-time-report.dto';

const PDFDocument = require('pdfkit');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const EMAIL_TO = 'rsilva@e4asolutions.com';

function minutesToStr(mins: number | null | undefined): string {
  if (mins == null) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h < 12 ? 'AM' : 'PM';
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function calcHours(inMins: number | null | undefined, outMins: number | null | undefined): number {
  if (inMins == null || outMins == null) return 0;
  const diff = outMins - inMins;
  return diff > 0 ? Math.round(diff * 100 / 60) / 100 : 0;
}

@Injectable()
export class TimeReportService {
  private readonly logger = new Logger(TimeReportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTimeReportDto, userId: string) {
    const report = await this.prisma.timeReport.create({
      data: {
        userId,
        weekStart: new Date(dto.weekStart),
        employees: {
          create: dto.employees.map(emp => ({
            name: emp.name,
            employeeId: emp.employeeId,
            days: {
              create: emp.days.map(day => ({
                dayName: day.dayName,
                date: new Date(day.date),
                perDiem: day.perDiem,
                shifts: {
                  create: day.shifts.map(shift => ({
                    projectId: shift.projectId,
                    timeIn: shift.timeIn,
                    timeOut: shift.timeOut,
                    shiftNum: shift.shiftNum,
                  })),
                },
              })),
            },
          })),
        },
      },
      include: { employees: { include: { days: { include: { shifts: true } } } } },
    });
    return report;
  }

  async findAll(userId: string) {
    return this.prisma.timeReport.findMany({
      where: { userId },
      orderBy: { weekStart: 'desc' },
      include: { employees: { select: { name: true } } },
    });
  }

  async findOne(id: string, userId: string) {
    const report = await this.prisma.timeReport.findUnique({
      where: { id },
      include: { employees: { include: { days: { include: { shifts: { orderBy: { shiftNum: 'asc' } } } } } } },
    });
    if (!report) throw new NotFoundException('Time report not found');
    if (report.userId !== userId) throw new ForbiddenException();
    return report;
  }

  async downloadPdf(id: string, userId: string): Promise<{ pdf: Buffer; filename: string }> {
    const report = await this.findOne(id, userId);
    const pdf = await this.generatePdf(report);
    const weekStr = new Date(report.weekStart).toISOString().split('T')[0];
    return { pdf, filename: `TimeReport_Week_${weekStr}.pdf` };
  }

  private async generatePdf(report: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const chunks: Buffer[] = [];
        doc.on('data', (c: Buffer) => chunks.push(c));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const BLUE = '#1E6FD9';
        const DARK = '#222222';
        const GRAY = '#666666';
        const LIGHT = '#F5F5F5';
        const GREEN_BG = '#D4EDDA';
        const GREEN_TEXT = '#155724';

        const weekStart = new Date(report.weekStart);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

        // Header
        doc.rect(40, 30, 515, 50).fill(BLUE);
        doc.fontSize(18).fillColor('#FFFFFF').text('E4A Solutions', 55, 40, { continued: false });
        doc.fontSize(11).fillColor('#FFFFFF').text('Weekly Time Report', 55, 62);
        doc.fontSize(11).fillColor('#FFFFFF').text(weekLabel, 300, 51, { width: 250, align: 'right' });
        doc.moveDown(3);

        let grandTotal = 0;

        for (const emp of report.employees) {
          const yEmpStart = doc.y;

          // Employee header
          doc.rect(40, doc.y, 515, 22).fill('#2C3E50');
          doc.fontSize(10).fillColor('#FFFFFF').text(
            `${emp.name}${emp.employeeId ? `  |  ID: ${emp.employeeId}` : ''}`,
            50, doc.y - 16,
          );
          doc.moveDown(0.5);

          // Table header
          const colX = [45, 95, 160, 220, 285, 345, 400, 460];
          const colW = [50, 65, 60, 65, 60, 55, 60, 75];
          const headers = ['Day', 'Date', 'Proj ID', 'Shift', 'In', 'Out', 'Hours', 'Per Diem'];

          doc.rect(40, doc.y, 515, 16).fill(BLUE);
          headers.forEach((h, i) => {
            doc.fontSize(7.5).fillColor('#FFFFFF').text(h, colX[i], doc.y - 11, { width: colW[i], align: 'center' });
          });
          doc.moveDown(0.3);

          let empTotal = 0;
          let rowIdx = 0;

          for (const day of emp.days) {
            const hasData = day.shifts.some((s: any) => s.timeIn != null && s.timeOut != null);
            const shifts = hasData ? day.shifts : [{ projectId: null, timeIn: null, timeOut: null, shiftNum: 1 }];

            for (let si = 0; si < shifts.length; si++) {
              const shift = shifts[si];
              const hrs = calcHours(shift.timeIn, shift.timeOut);
              empTotal += hrs;

              const rowY = doc.y;
              if (rowIdx % 2 === 0) doc.rect(40, rowY, 515, 14).fill(LIGHT);

              const cells = [
                si === 0 ? day.dayName : '',
                si === 0 ? new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
                shift.projectId || '—',
                shifts.length > 1 ? String(si + 1) : '1',
                minutesToStr(shift.timeIn),
                minutesToStr(shift.timeOut),
                hrs > 0 ? hrs.toFixed(2) : '0.00',
                '',
              ];

              cells.forEach((cell, i) => {
                doc.fontSize(7.5).fillColor(i === 6 && hrs > 0 ? '#1B5E20' : DARK)
                  .text(cell, colX[i], rowY + 3, { width: colW[i], align: i >= 3 ? 'center' : 'left' });
              });

              // Per Diem badge
              if (si === 0 && day.perDiem) {
                doc.rect(colX[7], rowY + 2, 70, 10).fill(GREEN_BG).stroke();
                doc.fontSize(7).fillColor(GREEN_TEXT).text('✔ Yes', colX[7], rowY + 3, { width: 70, align: 'center' });
              } else if (si === 0) {
                doc.fontSize(7.5).fillColor('#AAAAAA').text('—', colX[7], rowY + 3, { width: 70, align: 'center' });
              }

              doc.moveDown(0.18);
              rowIdx++;
            }
          }

          // Employee total
          grandTotal += empTotal;
          doc.rect(40, doc.y, 515, 16).fill('#1B4F72');
          doc.fontSize(9).fillColor('#FFFFFF')
            .text(`Total Hours: ${empTotal.toFixed(2)}`, 350, doc.y - 11, { width: 200, align: 'right' });
          doc.moveDown(1);

          if (doc.y > 720) doc.addPage();
        }

        // Grand total
        doc.rect(40, doc.y, 515, 22).fill(BLUE);
        doc.fontSize(11).fillColor('#FFFFFF')
          .text(`GRAND TOTAL: ${grandTotal.toFixed(2)} hours`, 40, doc.y - 16, { width: 515, align: 'center' });

        // Footer
        doc.fontSize(7).fillColor(GRAY)
          .text(`Generated ${new Date().toLocaleDateString('en-US')} | E4A Solutions | Sent to: ${EMAIL_TO}`, 40, 790, { width: 515, align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
