export const dynamic = "force-dynamic";

import { requireAuth } from "@/auth/requireAuth";
import { NextResponse } from "next/server";
import { getDashboardController } from "@/controllers/dashboard/admin/dashboard.controller";

export async function GET(request) {
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

    const result = await getDashboardController(auth.user);

    return NextResponse.json(result,
        {
            status: 200,
        }
    );


  } catch (error) {
    console.error("GET dashboard data route error", error);

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
