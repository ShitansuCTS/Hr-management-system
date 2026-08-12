/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,departmentId,name]` on the table `Designation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `organizationId` on table `Designation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Designation" DROP CONSTRAINT "Designation_organizationId_fkey";

-- AlterTable
ALTER TABLE "Designation" ALTER COLUMN "organizationId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Designation_organizationId_departmentId_name_key" ON "Designation"("organizationId", "departmentId", "name");

-- AddForeignKey
ALTER TABLE "Designation" ADD CONSTRAINT "Designation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
