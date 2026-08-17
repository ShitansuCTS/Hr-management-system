/*
  Warnings:

  - Made the column `organizationId` on table `LeaveApplication` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `LeaveBalance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `LeaveComment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LeaveApplication" DROP CONSTRAINT "LeaveApplication_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "LeaveBalance" DROP CONSTRAINT "LeaveBalance_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "LeaveComment" DROP CONSTRAINT "LeaveComment_organizationId_fkey";

-- AlterTable
ALTER TABLE "LeaveApplication" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "LeaveBalance" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "LeaveComment" ALTER COLUMN "organizationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "LeaveBalance" ADD CONSTRAINT "LeaveBalance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApplication" ADD CONSTRAINT "LeaveApplication_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveComment" ADD CONSTRAINT "LeaveComment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
