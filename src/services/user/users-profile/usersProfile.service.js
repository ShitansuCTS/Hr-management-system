import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { createSignedUrl } from "@/services/storage/createSignedUrl.service";
import { getOrganizationBucket } from "@/utils/storage/getOrganizationBucket";

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

// Get User Profile Service
export async function getUserProfileService(employeeId, currentUser) {
  try {
    if (!employeeId || typeof employeeId !== "string") {
      const error = new Error("Employee ID is required.");

      error.statusCode = 400;

      throw error;
    }

    const organizationId = currentUser.organizationId;

    const user = await prisma.user.findFirst({
      where: {
        employeeId: employeeId.trim(),
        organizationId,
        isDeleted: false,
        role: "EMPLOYEE",
      },

      include: {
        financialDetails: true,
        department: true,
        designation: true,
      },
    });

    if (!user) {
      const error = new Error("Employee not found.");

      error.statusCode = 404;

      throw error;
    }

    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.resetPasswordToken;
    delete safeUser.resetPasswordExpires;

    let profileImageUrl = null;

    if (safeUser.profileImageUrl) {
      try {
        const bucket = getOrganizationBucket(organizationId);

        const signedUrl = await createSignedUrl({
          bucket,
          storagePath: safeUser.profileImageUrl,
          expiresIn: 300,
        });

        profileImageUrl = signedUrl.signedUrl;
      } catch (error) {
        if (error.code === "STORAGE_OBJECT_NOT_FOUND") {
          try {
            await prisma.user.updateMany({
              where: {
                id: user.id,
                organizationId,
                profileImageUrl: safeUser.profileImageUrl,
              },
              data: { profileImageUrl: null },
            });
          } catch (cleanupError) {
            console.error("Failed to clear stale profile image reference:", {
              userId: user.id,
              message: cleanupError.message,
            });
          }
        } else {
          console.error("Failed to generate profile image URL:", {
            userId: user.id,
            organizationId,
            message: error.message,
          });
        }
      }
    }

    return {
      ...safeUser,
      profileImageUrl,
    };
  } catch (error) {
    console.error("Get Employee Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = new Error("Database operation failed.");

      prismaError.statusCode = 500;

      prismaError.errors = {
        database: "Database operation failed.",
      };

      throw prismaError;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const prismaError = new Error("Database validation failed.");

      prismaError.statusCode = 500;

      prismaError.errors = {
        database: "Database validation failed.",
      };

      throw prismaError;
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      const prismaError = new Error("Unable to connect to the database.");

      prismaError.statusCode = 500;

      prismaError.errors = {
        database: "Database connection failed.",
      };

      throw prismaError;
    }

    throw error;
  }
}

// Updates User Profile Service
export async function updateUserProfileService(employeeId, body, currentUser) {
  // Defense-in-depth authorization.
  if (currentUser?.role !== "ADMIN") {
    const error = new Error("Only ADMIN can update employee profiles.");
    error.statusCode = 403;
    throw error;
  }

  if (!employeeId || typeof employeeId !== "string") {
    throw validationError("Valid employee ID is required.");
  }
  employeeId = employeeId.trim();

  if (!currentUser?.organizationId || !currentUser?.id) {
    const error = new Error("Invalid authenticated user.");
    error.statusCode = 401;
    throw error;
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw validationError("Invalid request body.");
  }

  const { financialDetails: financialData, ...userData } = body;

  try {
    await prisma.$transaction(async (tx) => {
      // Find employee within the ADMIN's organization.
      const employee = await tx.user.findFirst({
        where: {
          employeeId,
          organizationId: currentUser.organizationId,
          role: "EMPLOYEE",
          isDeleted: false,
        },
        select: {
          id: true,
          departmentId: true,
        },
      });

      if (!employee) {
        const error = new Error("Employee not found.");
        error.statusCode = 404;
        throw error;
      }

      const nextDepartmentId = Object.prototype.hasOwnProperty.call(userData, "departmentId")
        ? userData.departmentId
        : employee.departmentId;

      // If department changes and designation is not supplied,
      // clear the old designation.
      if (
        Object.prototype.hasOwnProperty.call(userData, "departmentId") &&
        userData.departmentId !== employee.departmentId &&
        !Object.prototype.hasOwnProperty.call(userData, "designationId")
      ) {
        userData.designationId = null;
      }

      // Validate department.
      if (nextDepartmentId) {
        const department = await tx.department.findFirst({
          where: {
            id: nextDepartmentId,
            organizationId: currentUser.organizationId,
            isActive: true,
          },
          select: { id: true },
        });

        if (!department) {
          throw validationError("Selected department is invalid or inactive.");
        }
      }

      // Validate designation belongs to the selected department.
      const nextDesignationId = Object.prototype.hasOwnProperty.call(userData, "designationId")
        ? userData.designationId
        : undefined;

      if (nextDesignationId) {
        if (!nextDepartmentId) {
          throw validationError("A department is required for the selected designation.");
        }

        const designation = await tx.designation.findFirst({
          where: {
            id: nextDesignationId,
            departmentId: nextDepartmentId,
            organizationId: currentUser.organizationId,
            isActive: true,
          },
          select: { id: true },
        });

        if (!designation) {
          throw validationError("Selected designation is invalid for this department.");
        }
      }

      // Update employee profile.
      if (Object.keys(userData).length > 0) {
        await tx.user.update({
          where: { id: employee.id },
          data: userData,
        });
      }

      // Create or update financial details.
      if (financialData) {
        await tx.financialDetails.upsert({
          where: {
            userId: employee.id,
          },
          create: {
            userId: employee.id,
            ...financialData,
          },
          update: financialData,
        });
      }

      // Record activity.
      await tx.userActivity.create({
        data: {
          userId: employee.id,
          organizationId: currentUser.organizationId,
          action: "PROFILE_UPDATED",
          description: `Employee profile updated by ADMIN (${currentUser.id}).`,
        },
      });
    });

    // Return the same safe profile structure used by GET.
    return await getUserProfileService(employeeId, currentUser);
  } catch (error) {
    if (error.code === "P2002") {
      const conflictError = new Error("Email address is already being used.");
      conflictError.statusCode = 409;
      throw conflictError;
    }

    throw error;
  }
}
