"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTimeReportDto = exports.TimeEmployeeDto = exports.TimeDayDto = exports.TimeShiftDto = void 0;
class TimeShiftDto {
    projectId;
    timeIn;
    timeOut;
    shiftNum;
}
exports.TimeShiftDto = TimeShiftDto;
class TimeDayDto {
    dayName;
    date;
    perDiem;
    shifts;
}
exports.TimeDayDto = TimeDayDto;
class TimeEmployeeDto {
    name;
    employeeId;
    days;
}
exports.TimeEmployeeDto = TimeEmployeeDto;
class CreateTimeReportDto {
    weekStart;
    employees;
}
exports.CreateTimeReportDto = CreateTimeReportDto;
//# sourceMappingURL=create-time-report.dto.js.map