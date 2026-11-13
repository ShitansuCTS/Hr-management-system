import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import sanitizeHtml from "sanitize-html";

import { createSignedUrl } from "@/services/storage/createSignedUrl.service";
import { getOrganizationBucket } from "@/utils/storage/getOrganizationBucket";


export async function createLeaveCommentService(commentData, leaveId, currentUser) {
  try {
    const organizationId = currentUser.organizationId;

    const safeMessage = sanitizeHtml(commentData.message, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    const leave = await prisma.leaveApplication.findFirst({
      where: {
        id: leaveId,
        organizationId,
      },
    });

    if (!leave) {
      const error = new Error("Leave not found");

      error.statusCode = 404;

      throw error;
    }

    if (leave.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      const error = new Error("Not allowed");

      error.statusCode = 403;

      throw error;
    }

    const comment = await prisma.leaveComment.create({
      data: {
        organizationId,

        leaveId,

        userId: currentUser.id,

        message: safeMessage,
      },

      include: {
        user: {
          select: {
            fullName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return comment;
  } catch (error) {
    console.error("Create Leave Comment Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      const customError = new Error("Invalid reference data.");

      customError.statusCode = 400;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const customError = new Error("Invalid comment data.");

      customError.statusCode = 400;

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

export async function getLeaveCommentsService(leaveId, currentUser) {
  try {
    const organizationId = currentUser.organizationId;

    const leave = await prisma.leaveApplication.findFirst({
      where: {
        id: leaveId,
        organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    if (!leave) {
      const error = new Error("Leave not found");
      error.statusCode = 404;
      throw error;
    }

    if (leave.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      const error = new Error("You are not allowed to view comments");
      error.statusCode = 403;
      throw error;
    }

    const comments = await prisma.leaveComment.findMany({
      where: {
        leaveId,
        organizationId,
      },
      include: {
        user: {
          select: {
            fullName: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get organization storage bucket
    const bucket = getOrganizationBucket(organizationId);

    // Cache signed URLs to avoid generating duplicate URLs
    const imageUrlCache = new Map();

    // Generate signed URL for profile images
    const getSignedProfileImage = async (imagePath) => {
      if (!imagePath) return null;

      const storagePath = imagePath.replace(/[\r\n]/g, "").trim();

      if (!storagePath) return null;

      try {
        if (imageUrlCache.has(storagePath)) {
          return await imageUrlCache.get(storagePath);
        }

        const signedUrlPromise = createSignedUrl({
          bucket,
          storagePath,
          expiresIn: 300,
        }).then((result) => result.signedUrl);

        imageUrlCache.set(storagePath, signedUrlPromise);

        return await signedUrlPromise;
      } catch (error) {
        console.error("Failed to generate leave comment profile image URL:", {
          organizationId,
          storagePath,
          message: error.message,
        });

        imageUrlCache.delete(storagePath);
        return null;
      }
    };

    // Format initial leave application note
    const initialNote = leave.reason
      ? [
        {
          id: `leave-note-${leave.id}`,
          leaveId: leave.id,
          userId: leave.userId,
          message: leave.reason,
          createdAt: leave.createdAt,
          user: leave.user
            ? {
              ...leave.user,
              profileImageUrl: await getSignedProfileImage(
                leave.user.profileImageUrl
              ),
            }
            : null,
          isInitialNote: true,
        },
      ]
      : [];

    // Format comments with signed profile image URLs
    const formattedComments = await Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        user: comment.user
          ? {
            ...comment.user,
            profileImageUrl: await getSignedProfileImage(
              comment.user.profileImageUrl
            ),
          }
          : null,
      }))
    );

    return [...initialNote, ...formattedComments];
  } catch (error) {
    console.error("Get Leave Comments Service Error:", error);

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
