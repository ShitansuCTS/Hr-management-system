import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Resend } from "resend";
import sanitizeHtml from "sanitize-html";
import { announcementTemplate } from "@/templates/announcement.template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createAnnouncementService(announcementData, currentUser) {
  try {
    const { subject, mailBody, sendType, emails } = announcementData;

    let emailList = [];

    // Send to all users
    if (sendType === "ALL") {
      const recipients = await prisma.user.findMany({
        where: {
          organizationId: currentUser.organizationId,

          status: "ACTIVE",

          isDeleted: false,

          email: {
            not: "",
          },
        },

        select: {
          id: true,
          email: true,
        },
      });

      emailList = recipients.map((user) => user.email);
    }

    // Send to selected users
    if (sendType === "INDIVIDUAL") {
      emailList = emails;
    }

    if (!emailList.length) {
      const error = new Error("No recipients found");

      error.statusCode = 400;

      throw error;
    }

    // Fetch users only once
    const users = await prisma.user.findMany({
      where: {
        organizationId: currentUser.organizationId,

        email: {
          in: emailList,
        },

        status: "ACTIVE",

        isDeleted: false,
      },

      select: {
        id: true,
        email: true,
      },
    });

    if (!users.length) {
      const error = new Error("No valid users found");

      error.statusCode = 400;

      throw error;
    }
    // Sanitize  subject
    const safeSubject = sanitizeHtml(subject);
    const safeMailBody = sanitizeHtml(mailBody);

    // Transaction
    const announcement = await prisma.$transaction(async (tx) => {
      const announcement = await tx.announcement.create({
        data: {
          organizationId: currentUser.organizationId,

          createdById: currentUser.id,

          title: safeSubject,

          message: safeMailBody,

          sendType,
        },
      });

      await tx.announcementRecipient.createMany({
        data: users.map((user) => ({
          announcementId: announcement.id,

          userId: user.id,

          email: user.email,

          isRead: false,
        })),
      });

      return announcement;
    });

    
    const emailResponse = await resend.emails.send({
      from: "HR Team <hr@odishabiz.com>",

      to: emailList,

      subject: safeSubject,

      html: announcementTemplate(safeMailBody),
    });

    console.log("Resend Response:", emailResponse);

    return emailList.length;
  } catch (error) {
    console.error("Create announcement service failed:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      const customError = new Error("Record not found");

      customError.statusCode = 404;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const customError = new Error("Duplicate record already exists");

      customError.statusCode = 409;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      const customError = new Error("Invalid reference data");

      customError.statusCode = 400;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const customError = new Error("Invalid input data");

      customError.statusCode = 400;

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

export async function getAnnouncementService() {
  const announcements = await prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
    select: {
      id: true,
      title: true,
      message: true,
      createdAt: true,

      recipients: {
        take: 4,
        select: {
          user: {
            select: {
              fullName: true,
              profileImageUrl: true,
            },
          },
        },
      },
      _count: {
        select: {
          recipients: true,
        },
      },
    },
  });

  return announcements;
}


