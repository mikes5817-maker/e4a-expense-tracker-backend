import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
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

  @Post('send')
  @ApiOperation({ summary: 'Generate PDF report and email it' })
  send(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.reportService.sendReport(projectId, user.id);
  }
}
