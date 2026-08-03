export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import { downloadEmployeeTemplateController } from "@/controllers/user/downloadEmployeeTemplate.controller";

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

    return await downloadEmployeeTemplateController();
  } catch (error) {
    console.error("Download Employee Template Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to download employee template.",
        errors: error.errors || {},
      },
      {
        status: error.statusCode || 500,
      }
    );
  }
}
