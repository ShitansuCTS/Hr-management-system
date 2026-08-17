-- AlterTable
ALTER TABLE "LeaveApplication" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "LeaveBalance" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "LeaveComment" ADD COLUMN     "organizationId" TEXT;

-- CreateIndex
CREATE INDEX "LeaveApplication_organizationId_idx" ON "LeaveApplication"("organizationId");

-- CreateIndex
CREATE INDEX "LeaveApplication_userId_idx" ON "LeaveApplication"("userId");

-- CreateIndex
CREATE INDEX "LeaveBalance_organizationId_idx" ON "LeaveBalance"("organizationId");

-- CreateIndex
CREATE INDEX "LeaveBalance_userId_idx" ON "LeaveBalance"("userId");

-- CreateIndex
CREATE INDEX "LeaveComment_organizationId_idx" ON "LeaveComment"("organizationId");

-- AddForeignKey
ALTER TABLE "LeaveBalance" ADD CONSTRAINT "LeaveBalance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApplication" ADD CONSTRAINT "LeaveApplication_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveComment" ADD CONSTRAINT "LeaveComment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
