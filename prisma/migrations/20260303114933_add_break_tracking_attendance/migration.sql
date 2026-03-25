-- CreateTable
CREATE TABLE "Break" (
    "id" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),

    CONSTRAINT "Break_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Employee_firstName_idx" ON "Employee"("firstName");

-- CreateIndex
CREATE INDEX "Employee_lastName_idx" ON "Employee"("lastName");

-- AddForeignKey
ALTER TABLE "Break" ADD CONSTRAINT "Break_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
