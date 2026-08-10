import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

    const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;

    return {
      ...safeUser,

      resetPasswordExpires: resetPasswordExpires ? resetPasswordExpires.toISOString() : null,
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
