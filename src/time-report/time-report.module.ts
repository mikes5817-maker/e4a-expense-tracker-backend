import { Module } from '@nestjs/common';
import { TimeReportController } from './time-report.controller';
import { TimeReportService } from './time-report.service';

@Module({
  controllers: [TimeReportController],
  providers: [TimeReportService],
})
export class TimeReportModule {}
