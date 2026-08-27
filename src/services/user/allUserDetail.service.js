import { prisma } from "@/lib/prisma";
import { Prisma, Role } from "@prisma/client";

import bcrypt from "bcryptjs";

import { uploadProfileImage } from "./uploadProfileImage.service";
import { createFinancialDetails } from "./financial.service";
import { allocateDefaultLeaveBalances } from "./leaveBalance.service";
import { sendWelcomeEmail } from "./welcomeEmail.service";

import { deleteFile } from "@/services/storage/deleteFile.service";

import { createSignedUrl } from "@/services/storage/createSignedUrl.service";
import { getOrganizationBucket } from "@/utils/storage/getOrganizationBucket";

export async function createUserService(userData, currentUser) {
  let uploadedProfileImage = null;

  try {
    const employeeId = `CTSL${userData.employeeId}`;

    uploadedProfileImage = await uploadProfileImage(userData.profileImage, currentUser, employeeId);

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

          profileImageUrl: uploadedProfileImage?.storagePath ?? null,

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

      await allocateDefaultLeaveBalances(tx, createdUser.id, currentUser.organizationId);

      return createdUser;
    });

    await sendWelcomeEmail(user);

    const { password, ...safeUser } = user;

    return safeUser;
  } catch (error) {
    console.error("Create User Service:", error);

    if (uploadedProfileImage) {
      try {
        await deleteFile({
          bucket: uploadedProfileImage.bucket,
          storagePath: uploadedProfileImage.storagePath,
        });
      } catch (cleanupError) {
        console.error("CRITICAL: Failed to cleanup profile image after user creation failure:", {
          organizationId: currentUser.organizationId,

          employeeId,

          storagePath: uploadedProfileImage.storagePath,

          error: cleanupError,
        });
      }
    }

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

export async function getAllUsersDetailsService(currentUser, departmentId) {
  try {
    const organizationId = currentUser.organizationId;

    const whereCondition = {
      organizationId,
      isDeleted: false,
    };

    if (departmentId) {
      whereCondition.departmentId = departmentId;
    }

    const users = await prisma.user.findMany({
      where: whereCondition,

      select: {
        id: true,
        fullName: true,
        designation: {
          select: {
            id: true,
            name: true,
          },
        },
        email: true,
        phone: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
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

    const bucket = getOrganizationBucket(organizationId);

    const usersWithProfileImages = await Promise.all(
      users.map(async (user) => {
        if (!user.profileImageUrl) {
          return user;
        }

        try {
          const signedUrl = await createSignedUrl({
            bucket,
            storagePath: user.profileImageUrl,
            expiresIn: 300,
          });

          console.log("image link",signedUrl.signedUrl);
          
          return {
            ...user,
            profileImageUrl: signedUrl.signedUrl,
          };

        } catch (error) {
          console.error("Failed to generate profile image URL:", {
            userId: user.id,
            organizationId,
            error,
          });

          return {
            ...user,
            profileImageUrl: null,
          };
        }
      })
    );

    return usersWithProfileImages;
  } catch (error) {
    console.error("Get All Users Details Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const customError = new Error("Database operation failed.");

      customError.statusCode = 500;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const customError = new Error("Database validation failed.");

      customError.statusCode = 500;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      const customError = new Error("Database connection failed.");

      customError.statusCode = 500;

      throw customError;
    }

    throw error;
  }
}
