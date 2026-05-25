import { Controller, Get, Post, Param, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReportService } from './report.service';

@ApiTags('Reports')
@Controller('api/projects/:projectId/report')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('preview')
  @ApiOperation({ summary: 'Preview report data for a project' })
  preview(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.reportService.getReportPreview(projectId, user.id);
  }

  @Get('download')
  @ApiOperation({ summary: 'Download PDF report for a project' })
  async download(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string },
    @Res() res: Response,
  ) {
    const { pdf, filename } = await this.reportService.generateReportPdf(projectId, user.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf);
  }

  @Post('send')
  @ApiOperation({ summary: 'Generate PDF report and email it' })
  send(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.reportService.sendReport(projectId, user.id);
  }
}
