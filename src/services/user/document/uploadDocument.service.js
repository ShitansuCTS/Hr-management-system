import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import {
  normalizeDocumentType,
  buildDocumentStoragePath,
} from "@/utils/documents/buildDocumentStoragePath";

import { getOrganizationBucket } from "@/utils/storage/getOrganizationBucket";

import { uploadFile } from "@/services/storage/uploadFile.service";
import { deleteFile } from "@/services/storage/deleteFile.service";

export async function uploadDocumentService({ employeeId, currentUser, document, file }) {
  let uploadedFile = null;

  try {
    const organizationId = currentUser.organizationId;

    const normalizedDocumentType = normalizeDocumentType(document.documentType);

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
        const error = new Error("You are not allowed to upload documents for this user.");

        error.statusCode = 403;

        throw error;
      }
    }

    if (currentUser.role === "ADMIN") {
      const isSelf = targetUser.id === currentUser.id;

      const isEmployee = targetUser.role === "EMPLOYEE";

      if (!isSelf && !isEmployee) {
        const error = new Error("You are not allowed to upload documents for this user.");

        error.statusCode = 403;

        throw error;
      }
    }

    const existingDocument = await prisma.userDocument.findFirst({
      where: {
        organizationId,
        userId: targetUser.id,
        documentType: normalizedDocumentType,
      },

      select: {
        id: true,
      },
    });

    if (existingDocument) {
      const error = new Error("This document type is already uploaded.");

      error.statusCode = 409;

      throw error;
    }

    const bucket = getOrganizationBucket(organizationId);

    const { folder, fileName } = buildDocumentStoragePath({
      employeeId: targetUser.employeeId,
      documentType: normalizedDocumentType,
      extension: file.extension,
    });

    uploadedFile = await uploadFile({
      bucket,
      folder,
      fileName,
      buffer: file.buffer,
      contentType: file.mimeType,
    });

    try {
      const createdDocument = await prisma.userDocument.create({
        data: {
          userId: targetUser.id,

          organizationId,

          uploadedById: currentUser.id,

          documentType: normalizedDocumentType,

          documentName: document.documentName,

          storagePath: uploadedFile.storagePath,

          mimeType: file.mimeType,

          fileSize: file.size,
        },
      });

      return createdDocument;
    } catch (prismaError) {
      console.error("Prisma document creation failed after Supabase upload:", prismaError);

      try {
        await deleteFile({
          bucket: uploadedFile.bucket,
          storagePath: uploadedFile.storagePath,
        });
      } catch (cleanupError) {
        console.error("CRITICAL: Failed to cleanup Supabase file:", cleanupError);
      }

      throw prismaError;
    }
  } catch (error) {
    console.error("Upload Document Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const customError = new Error("This document type is already uploaded.");

        customError.statusCode = 409;

        throw customError;
      }

      if (error.code === "P2003") {
        const customError = new Error("Invalid document reference.");

        customError.statusCode = 400;

        throw customError;
      }
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
