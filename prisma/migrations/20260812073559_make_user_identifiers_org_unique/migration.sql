/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,employeeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_employeeId_organizationId_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_organizationId_employeeId_key" ON "User"("organizationId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_organizationId_email_key" ON "User"("organizationId", "email");
