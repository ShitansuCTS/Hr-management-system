import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { getOrganizationBucket } from "@/utils/storage/getOrganizationBucket";
import { createSignedUrl } from "@/services/storage/createSignedUrl.service";

export async function getSingleDocumentService(employeeId, documentId, currentUser) {
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

    const document = await prisma.userDocument.findFirst({
      where: {
        id: documentId,
        organizationId,
        userId: targetUser.id,
      },

      select: {
        id: true,
        userId: true,
        organizationId: true,
        documentType: true,
        documentName: true,
        storagePath: true,
        mimeType: true,
        fileSize: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!document) {
      const error = new Error("Document not found.");

      error.statusCode = 404;

      throw error;
    }

    const bucket = getOrganizationBucket(organizationId);

    const signedUrl = await createSignedUrl({
      bucket,
      storagePath: document.storagePath,
      expiresIn: 300,
    });

    return {
      id: document.id,
      userId: document.userId,
      organizationId: document.organizationId,
      documentType: document.documentType,
      documentName: document.documentName,
      mimeType: document.mimeType,
      fileSize: document.fileSize,
      isVerified: document.isVerified,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      downloadUrl: signedUrl.signedUrl,
      expiresIn: signedUrl.expiresIn,
    };
  } catch (error) {
    console.error("Get User Document Service Error:", error);

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
