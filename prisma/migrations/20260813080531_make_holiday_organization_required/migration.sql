/*
  Warnings:

  - Made the column `organizationId` on table `Holiday` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Holiday" DROP CONSTRAINT "Holiday_organizationId_fkey";

-- AlterTable
ALTER TABLE "Holiday" ALTER COLUMN "organizationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Holiday" ADD CONSTRAINT "Holiday_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
