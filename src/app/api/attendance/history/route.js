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

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    const data = await prisma.attendance.findMany({
      where: {
        organizationId: decoded.organizationId,
        userId: decoded.userId, // ✅ IMPORTANT FIX
      },
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

    const total = await prisma.attendance.count({
      where: {
        organizationId: decoded.organizationId,
        userId: decoded.userId, // ✅ MUST MATCH
      },
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
