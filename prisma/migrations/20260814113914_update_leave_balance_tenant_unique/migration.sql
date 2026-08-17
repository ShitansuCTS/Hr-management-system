/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,userId,leaveType,year]` on the table `LeaveBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LeaveBalance_userId_leaveType_year_key";

-- CreateIndex
CREATE UNIQUE INDEX "LeaveBalance_organizationId_userId_leaveType_year_key" ON "LeaveBalance"("organizationId", "userId", "leaveType", "year");
