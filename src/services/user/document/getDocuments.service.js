import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getDocumentsService(employeeId, currentUser) {
  try {
    const organizationId = currentUser.organizationId;

    const targetUser = await prisma.user.findFirst({
      where: {
        employeeId,
        organizationId,
        isDeleted: false,
      },

      select: {
        id: true,
        employeeId: true,
        role: true,
        fullName: true,
      },
    });

    if (!targetUser) {
      const error = new Error("User not found.");

      error.statusCode = 404;

      throw error;
    }

    if (currentUser.role === "EMPLOYEE") {
      if (targetUser.id !== currentUser.id) {
        const error = new Error("You are not allowed to view documents for this user.");

        error.statusCode = 403;

        throw error;
      }
    }

    if (currentUser.role === "ADMIN") {
      const isSelf = targetUser.id === currentUser.id;

      const isEmployee = targetUser.role === "EMPLOYEE";

      if (!isSelf && !isEmployee) {
        const error = new Error("You are not allowed to view documents for this user.");

        error.statusCode = 403;

        throw error;
      }
    }

    const documents = await prisma.userDocument.findMany({
      where: {
        organizationId,
        userId: targetUser.id,
      },

      select: {
        id: true,
        documentType: true,
        documentName: true,
        mimeType: true,
        fileSize: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return documents;
  } catch (error) {
    console.error("Get User Documents Service Error:", error);

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

    if (error.statusCode) {
      throw error;
    }

    throw error;
  }
}
