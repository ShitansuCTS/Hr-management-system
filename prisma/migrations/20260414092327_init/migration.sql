-- CreateTable
CREATE TABLE "SalaryStructure" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "basic" DOUBLE PRECISION NOT NULL,
    "hra" DOUBLE PRECISION NOT NULL,
    "medicalAllowance" DOUBLE PRECISION NOT NULL,
    "specialAllowance" DOUBLE PRECISION NOT NULL,
    "incentive" DOUBLE PRECISION NOT NULL,
    "providentFund" DOUBLE PRECISION NOT NULL,
    "professionTax" DOUBLE PRECISION NOT NULL,
    "esic" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryStructure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalaryStructure_userId_key" ON "SalaryStructure"("userId");

-- AddForeignKey
ALTER TABLE "SalaryStructure" ADD CONSTRAINT "SalaryStructure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
