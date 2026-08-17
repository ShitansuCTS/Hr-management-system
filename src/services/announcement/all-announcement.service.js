import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getAllAnnouncementService(currentUser) {
  try {
    let allAnnouncements;

    if (currentUser.role === "ADMIN") {
      allAnnouncements = await prisma.announcement.findMany({
        where: {
          organizationId: currentUser.organizationId,
        },

        include: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
              profileImageUrl: true,
              role: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (currentUser.role === "EMPLOYEE") {
      allAnnouncements = await prisma.announcement.findMany({
        where: {
          organizationId: currentUser.organizationId,

          OR: [
            {
              sendType: "ALL",
            },
            {
              recipients: {
                some: {
                  userId: currentUser.id,
                },
              },
            },
          ],
        },

        include: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
              profileImageUrl: true,
              role: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      const error = new Error("Unauthorized role");

      error.statusCode = 403;

      throw error;
    }

    return allAnnouncements;
  } catch (error) {
    console.error("Get All Announcements Service Error:", error);

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
