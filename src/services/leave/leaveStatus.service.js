import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { sendEmail } from "@/lib/email";
import { leaveApprovedTemplate } from "@/templates/leaveApproved.template";
import { leaveRejectedTemplate } from "@/templates/leaveRejected.template";

export async function updateLeaveStatusService(leaveStatus, leaveId, currentUser) {
  try {
    const { status } = leaveStatus;

    const organizationId = currentUser.organizationId;

    const leave = await prisma.leaveApplication.findFirst({
      where: {
        id: leaveId,
        organizationId,
      },

      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!leave) {
      const error = new Error("Leave not found");

      error.statusCode = 404;

      throw error;
    }

    if (leave.status !== "PENDING") {
      const error = new Error("Leave status has already been finalized");

      error.statusCode = 400;

      throw error;
    }

    if (leave.status === status) {
      const error = new Error(`Leave is already ${status.toLowerCase()}`);

      error.statusCode = 400;

      throw error;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const leaveStart = new Date(leave.startDate);

    leaveStart.setHours(0, 0, 0, 0);

    if (today >= leaveStart) {
      const error = new Error("Leave status cannot be updated on or after the leave start date.");

      error.statusCode = 400;

      throw error;
    }

    const updatedLeave = await prisma.leaveApplication.updateMany({
      where: {
        id: leaveId,
        organizationId,
      },

      data: {
        status,
      },
    });

    if (updatedLeave.count === 0) {
      const error = new Error("Leave not found");

      error.statusCode = 404;

      throw error;
    }

    if (status !== "PENDING") {
      let html = "";

      let subject = "";

      if (status === "APPROVED") {
        subject = "Your Leave Request Has Been Approved";

        html = leaveApprovedTemplate({
          userName: leave.user.fullName,

          leaveType: leave.leaveType,

          startDate: leave.startDate,

          endDate: leave.endDate,
        });
      }

      if (status === "REJECTED") {
        subject = "Your Leave Request Has Been Rejected";

        html = leaveRejectedTemplate({
          userName: leave.user.fullName,

          leaveType: leave.leaveType,

          startDate: leave.startDate,

          endDate: leave.endDate,
        });
      }

      await sendEmail({
        to: leave.user.email,

        subject,

        html,
      });
    }

    return {
      ...leave,
      status,
    };
  } catch (error) {
    console.error("Update Leave Status Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      const customError = new Error("Leave not found");

      customError.statusCode = 404;

      throw customError;
    }

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
