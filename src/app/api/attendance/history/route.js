import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

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

    const { searchParams } = new URL(request.url);

    // ✅ Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // ✅ Filters (NEW 🔥)
    const status = searchParams.get("status"); // PRESENT / ABSENT / INCOMPLETE
    const fromDate = searchParams.get("fromDate"); // 2026-04-01
    const toDate = searchParams.get("toDate"); // 2026-04-30

    // ✅ Build WHERE dynamically
    const where = {
      organizationId: decoded.organizationId,
      userId: decoded.userId,
    };

    if (status) {
      where.status = status;
    }

    if (fromDate && toDate) {
      where.date = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    }

    // ✅ Fetch Data
    const data = await prisma.attendance.findMany({
      where,
      orderBy: {
        date: "desc",
      },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            profileImageUrl: true,
            employeeId: true,
          },
        },
      },
    });

    // ✅ Total Count
    const total = await prisma.attendance.count({ where });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
