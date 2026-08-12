import { requireAuth } from "@/auth/requireAuth";
import { getUserProfileController } from "@/controllers/user/usersProfile.controller";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const auth = await requireAuth(request, ["ADMIN"]);

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        }
      );
    }

    const result = await getUserProfileController(params.employeeId, auth.user);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Get Employee Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
        errors: error.errors || {},
      },
      {
        status: error.statusCode || 500,
      }
    );
  }
}
