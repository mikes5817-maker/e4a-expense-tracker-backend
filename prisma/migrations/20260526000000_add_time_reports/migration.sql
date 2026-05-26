CREATE TABLE "time_reports" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "time_reports_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "time_employees" (
    "id" UUID NOT NULL,
    "time_report_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "employee_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "time_employees_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "time_days" (
    "id" UUID NOT NULL,
    "time_employee_id" UUID NOT NULL,
    "day_name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "per_diem" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "time_days_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "time_shifts" (
    "id" UUID NOT NULL,
    "time_day_id" UUID NOT NULL,
    "project_id" TEXT,
    "time_in" INTEGER,
    "time_out" INTEGER,
    "shift_num" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "time_shifts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "time_reports_user_id_idx" ON "time_reports"("user_id");
CREATE INDEX "time_employees_time_report_id_idx" ON "time_employees"("time_report_id");
CREATE INDEX "time_days_time_employee_id_idx" ON "time_days"("time_employee_id");
CREATE INDEX "time_shifts_time_day_id_idx" ON "time_shifts"("time_day_id");

ALTER TABLE "time_reports" ADD CONSTRAINT "time_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "time_employees" ADD CONSTRAINT "time_employees_time_report_id_fkey" FOREIGN KEY ("time_report_id") REFERENCES "time_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "time_days" ADD CONSTRAINT "time_days_time_employee_id_fkey" FOREIGN KEY ("time_employee_id") REFERENCES "time_employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "time_shifts" ADD CONSTRAINT "time_shifts_time_day_id_fkey" FOREIGN KEY ("time_day_id") REFERENCES "time_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;
