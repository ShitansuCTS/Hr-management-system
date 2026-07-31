export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";


export async function GET(request) {
  try {
    // 🔐 Auth
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId, // ✅ MUST be unique field
      },
      include: {
        financialDetails: true,   // 👈 ADD THIS
        department: true,      // ✅ Include department
        designation: true,     // ✅ Include designation
      },
    });


    const formattedUser = {
      ...user,
      password: undefined, // remove
      resetPasswordToken: undefined, // remove
      resetPasswordExpires: user.resetPasswordExpires
        ? user.resetPasswordExpires.toString()
        : null,
    };

    // console.log("The user is ", user);

    return NextResponse.json({
      success: true,
      user: formattedUser,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response("Error fetching users", { status: 500 });
  }
}
