/*
  Warnings:

  - You are about to drop the column `fileType` on the `UserDocument` table. All the data in the column will be lost.
  - Added the required column `fileSize` to the `UserDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDocument" DROP COLUMN "fileType",
ADD COLUMN     "fileSize" INTEGER NOT NULL;
