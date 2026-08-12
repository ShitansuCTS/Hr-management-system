-- DropIndex
DROP INDEX "Designation_name_departmentId_key";

-- AlterTable
ALTER TABLE "Designation" ADD COLUMN     "organizationId" TEXT;

-- CreateIndex
CREATE INDEX "Designation_organizationId_idx" ON "Designation"("organizationId");

-- AddForeignKey
ALTER TABLE "Designation" ADD CONSTRAINT "Designation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
