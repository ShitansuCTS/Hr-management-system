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

    if (!decoded?.userId || !decoded?.organizationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Normalize today's date (IMPORTANT)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Use UNIQUE query (FAST + SAFE)
    const attendance = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: decoded.userId,
          date: today,
        },
      },
    });

    return NextResponse.json({
      success: true,
      attendance: attendance || null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch attendance",
      },
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

    if (!decoded?.userId || !decoded?.organizationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🔥 Normalize date (MOST IMPORTANT)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔥 Use findUnique (NOT findFirst)
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: decoded.userId,
          date: today,
        },
      },
    });

    // ❌ Prevent duplicate punch-in
    if (existing) {
      return NextResponse.json({ message: "Already punched in today" }, { status: 400 });
    }

    // ✅ Create attendance
    const attendance = await prisma.attendance.create({
      data: {
        userId: decoded.userId,
        organizationId: decoded.organizationId,
        date: today,
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
      {
        success: false,
        message: error.message || "Punch in failed",
      },
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
    if (!decoded?.userId || !decoded?.organizationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { start, end } = getTodayRange();

    // 🔒 ALWAYS use unique constraint (userId + date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: decoded.userId,
          date: today,
        },
      },
    });

    // ❌ No punch in
    if (!attendance || !attendance.punchIn) {
      return NextResponse.json({ message: "You have not punched in today" }, { status: 400 });
    }

    // ❌ Already punched out
    if (attendance.punchOut) {
      return NextResponse.json({ message: "Already punched out" }, { status: 400 });
    }

    // ❌ Safety check: ensure same day punch-out
    if (attendance.date < start || attendance.date > end) {
      return NextResponse.json({ message: "Invalid attendance record" }, { status: 400 });
    }

    const now = new Date();

    // ✅ Prevent negative/invalid time
    if (now < attendance.punchIn) {
      return NextResponse.json({ message: "Invalid punch out time" }, { status: 400 });
    }

    const totalMinutes = Math.max(
      0,
      Math.floor((now.getTime() - attendance.punchIn.getTime()) / 60000)
    );

    // 🔒 Atomic update
    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        punchOut: now,
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
      {
        success: false,
        message: error.message || "Punch out failed",
      },
      { status: 500 }
    );
  }
}
