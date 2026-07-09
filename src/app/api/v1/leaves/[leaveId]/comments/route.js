import { NextResponse } from "next/server";

import { requireAuth } from "@/auth/requireAuth";

import {
  createLeaveCommentController,
  getLeaveCommentsController,
} from "@/controllers/leave/leaveComment.controller";

export async function POST(request, { params }) {
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

    const body = await request.json();

    const result = await createLeaveCommentController(body, params.leaveId, auth.user);

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("Create Leave Comment Route Error:", error);

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

export async function GET(request, { params }) {
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

    const result = await getLeaveCommentsController(params.leaveId, auth.user);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Get Leave Comments Route Error:", error);

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
