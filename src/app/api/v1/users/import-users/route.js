import { requireAuth } from "@/auth/requireAuth";
import { NextResponse } from "next/server";
import { importUsersController } from "@/controllers/user/importUsers.controller";

export async function POST(request) {
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

    const result = await importUsersController(request, auth.user);

    return NextResponse.json(result, {
      status: result.statusCode,
    });
  } catch (error) {
    console.error("Import Route:", error);

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
