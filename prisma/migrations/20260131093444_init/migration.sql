/*
  Warnings:

  - Changed the type of `leaveType` on the `LeaveBalance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('PAID_LEAVE', 'SICK_LEAVE', 'CASUAL_LEAVE', 'MATERNITY_LEAVE', 'PATERNITY_LEAVE', 'BEREAVEMENT_LEAVE', 'OPTIONAL_LEAVE');

-- AlterTable
ALTER TABLE "LeaveBalance" DROP COLUMN "leaveType",
ADD COLUMN     "leaveType" "LeaveType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LeaveBalance_userId_leaveType_key" ON "LeaveBalance"("userId", "leaveType");
