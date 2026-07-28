import { prisma } from "@/lib/prisma";
import { Prisma, Role } from "@prisma/client";

import bcrypt from "bcryptjs";

import { uploadProfileImage } from "./uploadProfileImage.service";
import { createFinancialDetails } from "./financial.service";
import { allocateDefaultLeaveBalances } from "./leaveBalance.service";
import { sendWelcomeEmail } from "./welcomeEmail.service";

export async function createUserService(userData, currentUser) {
  try {
    const { profileImageUrl, profileImagePublicId } = await uploadProfileImage(
      userData.profileImage
    );

    const employeeId = `CTSL${userData.employeeId}`;

    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_USER_PASSWORD, 10);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: userData.email,

          password: hashedPassword,

          role: Role.EMPLOYEE,

          employeeId,

          fullName: userData.fullName,

          phone: userData.phone,

          profileImageUrl,

          profileImagePublicId,

          designationId: userData.designation,

          departmentId: userData.department,

          employmentType: userData.employmentType,

          workLocation: userData.workLocation,

          dateOfJoining: userData.dateOfJoining,

          gender: userData.gender,

          dateOfBirth: userData.dateOfBirth,

          bloodGroup: userData.bloodGroup,

          fatherName: userData.fatherName,

          motherName: userData.motherName,

          spouseName: userData.spouseName,

          currentAddress: userData.currentAddress,

          permanentAddress: userData.permanentAddress,

          city: userData.city,

          state: userData.state,

          country: userData.country,

          pincode: userData.pincode,

          emergencyContactName: userData.emergencyContactName,

          emergencyContactPhone: userData.emergencyContactPhone,

          emergencyContactRelation: userData.emergencyContactRelation,

          reportingManagerName: userData.reportingManagerName,

          organizationId: currentUser.organizationId,
        },
      });

      await createFinancialDetails(tx, createdUser.id, userData);

      await tx.payrollSettings.create({
        data: {
          userId: createdUser.id,
        },
      });

      await allocateDefaultLeaveBalances(tx, createdUser.id);

      return createdUser;
    });

    await sendWelcomeEmail(user);

    return user;
  } catch (error) {
    console.error("Create User Service:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = error.meta?.target || [];

      const customError = new Error();

      customError.statusCode = 409;

      customError.errors = {};

      if (target.includes("email")) {
        customError.message = "Email already exists";

        customError.errors.email = "Email already exists";
      } else if (target.includes("employeeId")) {
        customError.message = "Employee ID already exists";

        customError.errors.employeeId = "Employee ID already exists";
      } else {
        customError.message = "Duplicate record already exists";
      }

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      const customError = new Error("Invalid designation or department.");

      customError.statusCode = 400;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const customError = new Error("Invalid user data");

      customError.statusCode = 400;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      const customError = new Error("Database connection failed");

      customError.statusCode = 500;

      throw customError;
    }

    throw error;
  }
}

export async function getAllUsersDetailsService(departmentId) {
  try {
    const whereCondition = {};

    if (departmentId) {
      whereCondition.departmentId = departmentId;
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        fullName: true,
        designation: true,
        email: true,
        phone: true,
        department: true,
        employeeId: true,
        profileImageUrl: true,
        lastLoginAt: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return users;
  } catch (error) {
    console.error("Get All Leave Applications Service Error:", error);

    if (error instanceof Prisma.PrismaClientInitializationError) {
      const customError = new Error("Database connection failed");

      customError.statusCode = 500;

      throw customError;
    }

    throw error;
  }
}
