-- DropIndex
DROP INDEX "Contact_employeeId_idx";

-- CreateIndex
CREATE INDEX "Contact_employeeId_type_tag_idx" ON "Contact"("employeeId", "type", "tag");
