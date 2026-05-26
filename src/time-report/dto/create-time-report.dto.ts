export class TimeShiftDto {
  projectId?: string;
  timeIn?: number;
  timeOut?: number;
  shiftNum: number;
}

export class TimeDayDto {
  dayName: string;
  date: string;
  perDiem: boolean;
  shifts: TimeShiftDto[];
}

export class TimeEmployeeDto {
  name: string;
  employeeId?: string;
  days: TimeDayDto[];
}

export class CreateTimeReportDto {
  weekStart: string;
  employees: TimeEmployeeDto[];
}
