-- DropIndex
DROP INDEX "Department_name_key";

-- DropIndex
DROP INDEX "Designation_name_key";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "organizationId" TEXT;

-- CreateIndex
CREATE INDEX "Department_organizationId_idx" ON "Department"("organizationId");

-- CreateIndex
CREATE INDEX "Designation_departmentId_idx" ON "Designation"("departmentId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
