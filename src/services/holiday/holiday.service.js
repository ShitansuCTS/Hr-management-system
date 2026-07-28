import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import sanitizeHtml from "sanitize-html";

export async function createHolidayService(holidayData, currentUser) {
  try {
    const { name, date, type, description } = holidayData;

    const [year, month, day] = date.split("-").map(Number);

    const holidayDate = new Date(year, month - 1, day);

    const safeDescription = sanitizeHtml(description ?? "", {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    const holidayDay = holidayDate.toLocaleDateString("en-IN", {
      weekday: "long",
    });

    const holiday = await prisma.holiday.create({
      data: {
        name: name,

        date: holidayDate,

        day: holidayDay,

        year: holidayDate.getFullYear(),

        type,

        description: safeDescription || null,

        organizationId: currentUser.organizationId,
      },
    });

    return holiday;
  } catch (error) {
    console.error("Create Holiday Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const customError = new Error("Holiday already exists for this date");

      customError.statusCode = 409;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      const customError = new Error("Invalid organization");

      customError.statusCode = 400;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const customError = new Error("Invalid holiday data");

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

export async function getHolidayService(currentUser) {
  try {
    const holidays = await prisma.holiday.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },

      orderBy: {
        date: "asc",
      },
    });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const upcoming = holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);

      holidayDate.setHours(0, 0, 0, 0);

      return holidayDate >= today;
    });

    const expired = holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);

      holidayDate.setHours(0, 0, 0, 0);

      return holidayDate < today;
    });

    return [...upcoming, ...expired];
  } catch (error) {
    console.error("Get Holiday Service Error:", error);

    if (error instanceof Prisma.PrismaClientInitializationError) {
      const customError = new Error("Database connection failed");

      customError.statusCode = 500;

      throw customError;
    }

    throw error;
  }
}
