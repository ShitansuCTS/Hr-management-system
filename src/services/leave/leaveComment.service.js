import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import sanitizeHtml from "sanitize-html";

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

    const initialNote = leave.reason
      ? [
          {
            id: `leave-note-${leave.id}`,

            leaveId: leave.id,

            userId: leave.userId,

            message: leave.reason,

            createdAt: leave.createdAt,

            user: {
              fullName: leave.user.fullName,

              profileImageUrl: leave.user.profileImageUrl,
            },

            isInitialNote: true,
          },
        ]
      : [];

    return [...initialNote, ...comments];
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
