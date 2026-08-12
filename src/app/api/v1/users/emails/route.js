export const dynamic = "force-dynamic";

import { requireAuth } from "@/auth/requireAuth";
import { NextResponse } from "next/server";
import { getAllEmailsController } from "@/controllers/user/allEmail.controller";

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

    const result = await getAllEmailsController(auth.user);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
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
