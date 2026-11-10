export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import { prisma } from "@/lib/prisma";


export async function GET(request) {
  try {
    const auth = await requireAuth(request, ["ADMIN", "EMPLOYEE"]);
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: auth.user.id,
      },
      include: {
        financialDetails: true,
        department: true,
        designation: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Profile not found." },
        { status: 404 }
      );
    }

    const formattedUser = {
      ...user,
      password: undefined,
      resetPasswordToken: undefined,
      resetPasswordExpires: user.resetPasswordExpires
        ? user.resetPasswordExpires.toString()
        : null,
    };

    return NextResponse.json({
      success: true,
      user: formattedUser,
    });
  } catch (error) {
    console.error("Get Current User Profile Route Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch profile." },
      { status: error.statusCode || 500 }
    );
  }
}
