import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

/**
 * ✅ Get today's start & end range (IMPORTANT for DateTime correctness)
 */
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * =========================
 * GET → Fetch today's attendance
 * =========================
 */
export async function GET(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { start, end } = getTodayRange();

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: decoded.userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    return NextResponse.json({
      success: true,
      attendance: attendance || null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

/**
 * =========================
 * POST → Punch In
 * =========================
 */
export async function POST(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { start, end } = getTodayRange();

    // check today's record
    const existing = await prisma.attendance.findFirst({
      where: {
        userId: decoded.userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    if (existing?.punchIn) {
      return NextResponse.json({ message: "Already punched in today" }, { status: 400 });
    }

    // 🔥 FIX HERE
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendance = await prisma.attendance.create({
      data: {
        userId: decoded.userId,
        organizationId: decoded.organizationId,
        date: today, // ✅ FIXED
        punchIn: new Date(),
        status: "INCOMPLETE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Punch in successful",
      attendance,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Punch in failed" },
      { status: 500 }
    );
  }
}

/**
 * =========================
 * PUT → Punch Out
 * =========================
 */
export async function PUT(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { start, end } = getTodayRange();

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: decoded.userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    if (!attendance || !attendance.punchIn) {
      return NextResponse.json({ message: "You have not punched in today" }, { status: 400 });
    }

    if (attendance.punchOut) {
      return NextResponse.json({ message: "Already punched out" }, { status: 400 });
    }

    const totalMinutes = Math.floor(
      (new Date().getTime() - attendance.punchIn.getTime()) / 1000 / 60
    );

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        punchOut: new Date(),
        totalMinutes,
        status: "PRESENT",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Punch out successful",
      attendance: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Punch out failed" },
      { status: 500 }
    );
  }
}
