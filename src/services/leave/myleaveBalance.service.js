import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getLeaveBalanceService(currentUser) {
  try {
    const currentYear = new Date().getFullYear();

    const organizationId = currentUser.organizationId;

    const leaveBalances = await prisma.leaveBalance.findMany({
      where: {
        userId: currentUser.id,
        year: currentYear,
        organizationId,
      },

      select: {
        leaveType: true,
        allocated: true,
        used: true,
        remaining: true,
        year: true,
      },

      orderBy: {
        leaveType: "asc",
      },
    });

    return leaveBalances;
  } catch (error) {
    console.error("Get Leave Balance Service Error:", error);

    if (error instanceof Prisma.PrismaClientInitializationError) {
      const customError = new Error("Database connection failed");

      customError.statusCode = 500;

      throw customError;
    }

    throw error;
  }
}
