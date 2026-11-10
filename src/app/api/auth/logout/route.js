import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(request) {
  const token = request.cookies.get("auth_token")?.value;
  const decoded = token ? verifyToken(token) : null;
  let activityError = null;

  if (decoded?.userId && decoded?.organizationId) {
    try {
      await prisma.userActivity.create({
        data: {
          userId: decoded.userId,
          organizationId: decoded.organizationId,
          action: "LOGOUT",
          description: "Logged out.",
        },
      });
    } catch (error) {
      console.error("Failed to record logout activity:", error);
      activityError = error;
    }
  }

  const res = NextResponse.json(
    activityError
      ? { success: false, message: "Logged out, but logout activity could not be recorded." }
      : { success: true, message: "Logged out successfully" },
    { status: activityError ? 500 : 200 }
  );

  // Remove JWT cookie
  res.cookies.set("auth_token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // 👈 immediately expire
  });

  return res;
}
