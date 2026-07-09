import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import sanitizeHtml from "sanitize-html";

export async function createLeaveCommentService(commentData, leaveId, currentUser) {
  try {
    const safeMessage = sanitizeHtml(commentData.message, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const leave = await prisma.leaveApplication.findUnique({
      where: {
        id: leaveId,
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

    return await prisma.leaveComment.create({
      data: {
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
  } catch (error) {
    console.error("Create Leave Comment Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      const customError = new Error("Invalid reference");

      customError.statusCode = 400;

      throw customError;
    }

    throw error;
  }
}

export async function getLeaveCommentsService(leaveId, currentUser) {
  try {
    const leave = await prisma.leaveApplication.findUnique({
      where: {
        id: leaveId,
      },

      include: {
        user: true,
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

    throw error;
  }
}
