export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/jwt";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  try {
    // 1️⃣ Validate token
    const token = request.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    // 2️⃣ Fetch ONLY active, non-deleted users with valid emails
    const users = await prisma.user.findMany({
      where: {
        status: "ACTIVE",
        isDeleted: false,
      },
      select: {
        email: true,
      },
    });

    // 3️⃣ Extract & deduplicate emails
    const emails = [...new Set(users.map((u) => u.email))];

    return NextResponse.json({
      success: true,
      emails,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch users",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
