-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "currentAddress" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "department" TEXT,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "emergencyContactRelation" TEXT,
ADD COLUMN     "employmentType" "EmploymentType",
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "motherName" TEXT,
ADD COLUMN     "permanentAddress" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "profileImageUrl" TEXT,
ADD COLUMN     "reportingManagerName" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "workLocation" TEXT;
