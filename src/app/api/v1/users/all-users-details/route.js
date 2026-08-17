export const dynamic = "force-dynamic";

import { requireAuth } from "@/auth/requireAuth";
import {
  createUserController,
  getAllUsersDetailsController,
} from "@/controllers/user/allUserDetail.controller";
import { NextResponse } from "next/server";

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

    const result = await createUserController(request, auth.user);

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

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

export async function GET(request) {
  try {
    const auth = await requireAuth(request, ["ADMIN", "EMPLOYEE"]);

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

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");

    const result = await getAllUsersDetailsController(auth.user, departmentId);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Fetching all-users-details failed: ", error);

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
