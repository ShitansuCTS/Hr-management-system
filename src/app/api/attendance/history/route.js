export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const auth = await requireAuth(request, ["ADMIN", "EMPLOYEE"]);

    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        userId: auth.user.id,
        organizationId: auth.user.organizationId,
      },
      orderBy: [{ date: "desc" }, { punchIn: "desc" }],
      take: 90,
      select: {
        id: true,
        date: true,
        punchIn: true,
        punchOut: true,
        totalMinutes: true,
        status: true,
      },
    });

    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    console.error("Get Attendance History Route Error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch attendance history." },
      { status: error.statusCode || 500 }
    );
  }
}
