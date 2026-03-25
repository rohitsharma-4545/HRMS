/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,type,tag]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Contact_employeeId_type_tag_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Contact_employeeId_type_tag_key" ON "Contact"("employeeId", "type", "tag");
