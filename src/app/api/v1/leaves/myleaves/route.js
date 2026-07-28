import { NextResponse } from "next/server";

import { requireAuth } from "@/auth/requireAuth";

import {
  createLeaveController,
  getLeaveApplicationsController,
} from "@/controllers/leave/leave.controller";

export async function POST(request) {
  try {
    const auth = await requireAuth(request, ["EMPLOYEE"]);

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

    const body = await request.json();

    const result = await createLeaveController(body, auth.user);

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("Create Leave Route Error:", error);

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
    const auth = await requireAuth(request, ["EMPLOYEE"]);

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

    const result = await getLeaveApplicationsController(auth.user);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Get Leave Route Error:", error);

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
