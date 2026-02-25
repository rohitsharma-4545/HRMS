/*
  Warnings:

  - You are about to drop the column `clockIn` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `clockOut` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `date` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_employeeId_fkey";

-- DropIndex
DROP INDEX "Attendance_employeeId_idx";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "clockIn",
DROP COLUMN "clockOut",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "punchIn" TIMESTAMP(3),
ADD COLUMN     "punchOut" TIMESTAMP(3),
ADD COLUMN     "totalHours" DOUBLE PRECISION,
ALTER COLUMN "status" SET DEFAULT 'PRESENT';

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
