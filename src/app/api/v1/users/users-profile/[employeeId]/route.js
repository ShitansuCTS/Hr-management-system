import { requireAuth } from "@/auth/requireAuth";
import {
  getUserProfileController,
  updateUserProfileController,
} from "@/controllers/user/usersProfile.controller";
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

    const { employeeId } = await params;
    const result = await getUserProfileController(employeeId, auth.user);

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

export async function PATCH(request, { params }) {
  try {
    // Only ADMIN can update employee profiles
    const auth = await requireAuth(request, ["ADMIN"]);

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.status === 403 ? "Only admins can update employee profiles." : auth.message,
        },
        { status: auth.status }
      );
    }

    const { employeeId } = await params;
    const body = await request.json();

    const result = await updateUserProfileController(employeeId, body, auth.user);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const status = error instanceof SyntaxError ? 400 : error.statusCode || 500;

    if (error instanceof SyntaxError) {
      console.warn("Rejected employee profile update with invalid JSON.");
    } else {
      console.error("Update Employee Route Error:", error);
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof SyntaxError
            ? "Request body must be valid JSON."
            : error.message || "Internal Server Error",
        errors: error.errors || {},
      },
      { status }
    );
  }
}
