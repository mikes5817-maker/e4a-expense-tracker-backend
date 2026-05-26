export declare class TimeShiftDto {
    projectId?: string;
    timeIn?: number;
    timeOut?: number;
    shiftNum: number;
}
export declare class TimeDayDto {
    dayName: string;
    date: string;
    perDiem: boolean;
    shifts: TimeShiftDto[];
}
export declare class TimeEmployeeDto {
    name: string;
    employeeId?: string;
    days: TimeDayDto[];
}
export declare class CreateTimeReportDto {
    weekStart: string;
    employees: TimeEmployeeDto[];
}
