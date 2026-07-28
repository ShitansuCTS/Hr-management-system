import { NextResponse } from "next/server";
import {
  createAnnouncementController,
  getAnnouncementController,
} from "@/controllers/announcement/announcement.controller";
import { requireAuth } from "@/auth/requireAuth";

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

    const body = await request.json();

    const result = await createAnnouncementController(body, auth.user);

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("Announcement POST failed:", error);

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

    const result = await getAnnouncementController();

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Announcement GET failed:", error);

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
