import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAttendanceDate, formatWorkingDuration } from "@/utils/attendance/getAttendanceDate";

export async function getTodayAttendance(user) {
  const today = getAttendanceDate();

  const [attendance, activeAttendance] = await Promise.all([
    prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    }),
    prisma.attendance.findFirst({
      where: {
        userId: user.id,
        organizationId: user.organizationId,
        punchIn: { not: null },
        punchOut: null,
      },
      orderBy: { punchIn: "desc" },
    }),
  ]);

  return {
    attendance,
    activeAttendance,
    status: activeAttendance
      ? "PUNCHED_IN"
      : attendance?.punchOut
        ? "PUNCHED_OUT"
        : "NOT_PUNCHED_IN",
  };
}

export async function punchIn(user) {
  const now = new Date();
  const date = getAttendanceDate(now);
  const activeAttendance = await prisma.attendance.findFirst({
    where: {
      userId: user.id,
      organizationId: user.organizationId,
      punchIn: { not: null },
      punchOut: null,
    },
    select: { id: true },
  });

  if (activeAttendance) {
    const error = new Error("You already have an active punch-in.");
    error.statusCode = 409;
    throw error;
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const attendance = await tx.attendance.create({
        data: {
          userId: user.id,
          organizationId: user.organizationId,
          date,
          punchIn: now,
          status: "INCOMPLETE",
        },
      });

      await tx.userActivity.create({
        data: {
          userId: user.id,
          organizationId: user.organizationId,
          action: "PUNCH_IN",
          description: `Punched in for work on ${date.toISOString().slice(0, 10)}.`,
          createdAt: now,
        },
      });

      return attendance;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const conflict = new Error("You have already punched in for this attendance day.");
      conflict.statusCode = 409;
      throw conflict;
    }

    throw error;
  }
}

export async function punchOut(user) {
  const attendance = await prisma.attendance.findFirst({
    where: {
      userId: user.id,
      organizationId: user.organizationId,
      punchIn: { not: null },
      punchOut: null,
    },
    orderBy: { punchIn: "desc" },
  });

  if (!attendance?.punchIn) {
    const error = new Error("You have not punched in.");
    error.statusCode = 400;
    throw error;
  }

  const punchOutTime = new Date();
  const totalMinutes = Math.max(
    0,
    Math.floor((punchOutTime.getTime() - attendance.punchIn.getTime()) / 60_000)
  );

  return prisma.$transaction(async (tx) => {
    const updatedAttendance = await tx.attendance.updateMany({
      where: {
        id: attendance.id,
        punchOut: null,
      },
      data: {
        punchOut: punchOutTime,
        totalMinutes,
        status: "PRESENT",
      },
    });

    if (updatedAttendance.count === 0) {
      const error = new Error("This attendance session has already been punched out.");
      error.statusCode = 409;
      throw error;
    }

    const savedAttendance = await tx.attendance.findUniqueOrThrow({
      where: { id: attendance.id },
    });

    await tx.userActivity.create({
      data: {
        userId: user.id,
        organizationId: user.organizationId,
        action: "PUNCH_OUT",
        description: `Punched out. Total working duration: ${formatWorkingDuration(totalMinutes)}.`,
        createdAt: punchOutTime,
      },
    });

    return savedAttendance;
  });
}
