/*
  Warnings:

  - You are about to drop the column `documentNumber` on the `UserDocument` table. All the data in the column will be lost.
  - You are about to drop the column `filePublicId` on the `UserDocument` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `UserDocument` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId,userId,documentType]` on the table `UserDocument` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mimeType` to the `UserDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storagePath` to the `UserDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedById` to the `UserDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `UserDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDocument" DROP COLUMN "documentNumber",
DROP COLUMN "filePublicId",
DROP COLUMN "fileUrl",
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "storagePath" TEXT NOT NULL,
ADD COLUMN     "uploadedById" TEXT NOT NULL,
DROP COLUMN "fileType",
ADD COLUMN     "fileType" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "UserDocument_uploadedById_idx" ON "UserDocument"("uploadedById");

-- CreateIndex
CREATE UNIQUE INDEX "UserDocument_organizationId_userId_documentType_key" ON "UserDocument"("organizationId", "userId", "documentType");

-- AddForeignKey
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
