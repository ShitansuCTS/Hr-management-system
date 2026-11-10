import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import { getUserProfileController } from "@/controllers/user/usersProfile.controller";

export async function GET(request, { params }) {
  try {
    const auth = await requireAuth(request, ["ADMIN"]);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const { employeeId } = params;
    const result = await getUserProfileController(employeeId, auth.user);

    return NextResponse.json({
      success: true,
      user: result.data,
    });
  } catch (error) {
    console.error("Get Employee Profile Route Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch employee profile." },
      { status: error.statusCode || 500 }
    );
  }
}
