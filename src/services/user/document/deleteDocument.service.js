import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { deleteFile } from "@/services/storage/deleteFile.service";
import { getOrganizationBucket } from "@/utils/storage/getOrganizationBucket";

export async function deleteDocumentService(employeeId, documentId, currentUser) {
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
      },
    });

    if (!targetUser) {
      const error = new Error("User not found.");

      error.statusCode = 404;

      throw error;
    }

    if (currentUser.role === "EMPLOYEE") {
      if (targetUser.id !== currentUser.id) {
        const error = new Error("You are not allowed to delete documents for this user.");

        error.statusCode = 403;

        throw error;
      }
    }

    if (currentUser.role === "ADMIN") {
      const isSelf = targetUser.id === currentUser.id;
      const isEmployee = targetUser.role === "EMPLOYEE";

      if (!isSelf && !isEmployee) {
        const error = new Error("You are not allowed to delete documents for this user.");

        error.statusCode = 403;

        throw error;
      }
    }

    const document = await prisma.userDocument.findFirst({
      where: {
        id: documentId,
        organizationId,
        userId: targetUser.id,
      },

      select: {
        id: true,
        storagePath: true,
      },
    });

    if (!document) {
      const error = new Error("Document not found.");

      error.statusCode = 404;

      throw error;
    }

    await prisma.userDocument.delete({
      where: {
        id: document.id,
      },
    });

    const bucket = getOrganizationBucket(organizationId);

    try {
      await deleteFile({
        bucket,
        storagePath: document.storagePath,
      });
    } catch (storageError) {
      console.error("CRITICAL: UserDocument deleted from database but Supabase cleanup failed.", {
        documentId: document.id,
        organizationId,
        userId: targetUser.id,
        storagePath: document.storagePath,
        error: storageError,
      });

      return {
        id: document.id,
        storageCleanupPending: true,
      };
    }

    return {
      id: document.id,
      storageCleanupPending: false,
    };
  } catch (error) {
    console.error("Delete Document Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        const customError = new Error("Document not found.");

        customError.statusCode = 404;

        throw customError;
      }

      if (error.code === "P2003") {
        const customError = new Error("Invalid document reference.");

        customError.statusCode = 400;

        throw customError;
      }

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
