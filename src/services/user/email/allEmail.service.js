import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getAllEmailsSerrvice(currentUser) {
  try {
    const organizationId = currentUser.organizationId;

    const users = await prisma.user.findMany({
      where: {
        organizationId,
        status: "ACTIVE",
        isDeleted: false,
      },
      select: {
        email: true,
      },
    });

    const emails = [...new Set(users.map((u) => u.email))];

    return emails;
  } catch (error) {
    console.error("Get All Emails Service Error:", error);

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
      const customError = new Error("Database connection failed");

      customError.statusCode = 500;

      throw customError;
    }

    throw error;
  }
}
