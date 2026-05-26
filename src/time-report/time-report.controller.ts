import { Controller, Get, Post, Param, Body, UseGuards, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TimeReportService } from './time-report.service';
import { CreateTimeReportDto } from './dto/create-time-report.dto';
import type { Response } from 'express';

@ApiTags('Time Reports')
@Controller('api/time-reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TimeReportController {
  constructor(private readonly timeReportService: TimeReportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new time report' })
  create(
    @Body() dto: CreateTimeReportDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.timeReportService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all time reports for current user' })
  findAll(@CurrentUser() user: { id: string }) {
    return this.timeReportService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific time report' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.timeReportService.findOne(id, user.id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download PDF for a time report' })
  async download(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Res() res: Response,
  ) {
    const { pdf, filename } = await this.timeReportService.downloadPdf(id, user.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf);
  }
}
