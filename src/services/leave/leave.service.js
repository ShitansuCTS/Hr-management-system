import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import sanitizeHtml from "sanitize-html";
import { sendEmail } from "@/lib/email";

import { adminLeaveNotificationTemplate } from "@/templates/adminLeaveNotification.template";
import { employeeLeaveSubmittedTemplate } from "@/templates/employeeLeaveSubmitted.template";

export async function createLeaveService(leaveData, currentUser) {
  try {
    const { leaveType, startDate, endDate, reason } = leaveData;

    const organizationId = currentUser.organizationId;

    const safeReason = sanitizeHtml(reason, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    const start = new Date(startDate);
    const end = new Date(endDate);

    const leaveDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const year = start.getFullYear();

    const leaveBalance = await prisma.leaveBalance.findUnique({
      where: {
        organizationId_userId_leaveType_year: {
          organizationId,
          userId: currentUser.id,
          leaveType,
          year,
        },
      },
    });

    if (!leaveBalance) {
      const error = new Error("Leave type is not assigned to this employee.");

      error.statusCode = 400;

      throw error;
    }

    if (leaveDays > leaveBalance.remaining) {
      const error = new Error("Insufficient leave balance.");

      error.statusCode = 400;

      throw error;
    }

    const application = await prisma.$transaction(async (tx) => {
      const leaveApplication = await tx.leaveApplication.create({
        data: {
          organizationId,

          userId: currentUser.id,

          leaveType,

          startDate: start,

          endDate: end,

          reason: safeReason,

          status: "PENDING",
        },
      });

      await tx.leaveBalance.update({
        where: {
          organizationId_userId_leaveType_year: {
            organizationId,
            userId: currentUser.id,
            leaveType,
            year,
          },
        },

        data: {
          used: {
            increment: leaveDays,
          },

          remaining: {
            decrement: leaveDays,
          },
        },
      });

      return leaveApplication;
    });

    const employee = await prisma.user.findFirst({
      where: {
        id: currentUser.id,
        organizationId,
        isDeleted: false,
      },

      select: {
        fullName: true,
        email: true,
      },
    });

    if (!employee) {
      const error = new Error("Employee not found.");

      error.statusCode = 404;

      throw error;
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL,

      subject: "New Leave Application",

      html: adminLeaveNotificationTemplate({
        employeeName: employee.fullName,

        leaveType,

        startDate,

        endDate,

        reason: safeReason,
      }),
    });

    await sendEmail({
      to: employee.email,

      subject: "Leave Request Submitted",

      html: employeeLeaveSubmittedTemplate({
        employeeName: employee.fullName,

        leaveType,

        startDate,

        endDate,

        reason: safeReason,
      }),
    });

    return {
      application,
      leaveDays,
    };
  } catch (error) {
    console.error("Create Leave Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      const customError = new Error("Leave balance or related record not found.");

      customError.statusCode = 404;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const customError = new Error("Duplicate record already exists.");

      customError.statusCode = 409;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      const customError = new Error("Invalid reference data.");

      customError.statusCode = 400;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const customError = new Error("Invalid input data.");

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

export async function getLeaveApplicationsService(currentUser) {
  try {
    const organizationId = currentUser.organizationId;

    const leaveApplications = await prisma.leaveApplication.findMany({
      where: {
        organizationId,

        userId: currentUser.id,
      },

      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return leaveApplications;
  } catch (error) {
    console.error("Get Leave Applications Service Error:", error);

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

export async function getAllLeaveApplicationsService(currentUser) {
  try {
    const organizationId = currentUser.organizationId;

    const allLeaveApplications = await prisma.leaveApplication.findMany({
      where: {
        organizationId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return allLeaveApplications;
  } catch (error) {
    console.error("Get All Leave Applications Service Error:", error);

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
