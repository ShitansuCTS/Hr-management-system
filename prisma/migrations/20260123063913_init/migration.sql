/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,organizationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateOfJoining` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfJoining" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "employeeId" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_organizationId_key" ON "User"("employeeId", "organizationId");
