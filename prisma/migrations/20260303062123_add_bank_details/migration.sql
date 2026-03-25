-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SAVINGS', 'CURRENT');

-- CreateTable
CREATE TABLE "BankDetail" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "branchName" TEXT,
    "accountHolderName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BankDetail_employeeId_idx" ON "BankDetail"("employeeId");

-- AddForeignKey
ALTER TABLE "BankDetail" ADD CONSTRAINT "BankDetail_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
