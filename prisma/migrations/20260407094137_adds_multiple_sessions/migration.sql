/*
  Warnings:

  - You are about to drop the column `punchIn` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `punchOut` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "punchIn",
DROP COLUMN "punchOut",
ADD COLUMN     "firstPunchIn" TIMESTAMP(3),
ADD COLUMN     "lastPunchOut" TIMESTAMP(3),
ALTER COLUMN "totalHours" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "AttendanceSession" (
    "id" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "punchIn" TIMESTAMP(3) NOT NULL,
    "punchOut" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AttendanceSession_attendanceId_idx" ON "AttendanceSession"("attendanceId");

-- CreateIndex
CREATE INDEX "Attendance_employeeId_date_idx" ON "Attendance"("employeeId", "date");

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
