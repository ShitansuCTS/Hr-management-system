export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import { getLeaveBalanceController } from "@/controllers/leave/myleaveBalance.controller";

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

    const result = await getLeaveBalanceController(auth.user);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Get Leave Balance Route Error:", error);

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
