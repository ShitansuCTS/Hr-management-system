export const dynamic = "force-dynamic";
import { requireAuth } from "@/auth/requireAuth";
import { NextResponse } from "next/server";
import { getAllAnnouncementController } from "@/controllers/announcement/all-announcement.controller";

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

    const result = await getAllAnnouncementController(auth.user);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error",
        errors: error.errors || {},
      },
      {
        status: error.statusCode || 500,
      }
    );
  }
}
