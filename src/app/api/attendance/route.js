export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import {
  getTodayAttendance,
  punchIn,
  punchOut,
} from "@/services/attendance/attendance.service";

async function authenticate(request) {
  const auth = await requireAuth(request, ["ADMIN", "EMPLOYEE"]);

  if (!auth.success) {
    return {
      response: NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      ),
    };
  }

  return { user: auth.user };
}

function errorResponse(error, fallbackMessage) {
  console.error(fallbackMessage, error);

  return NextResponse.json(
    {
      success: false,
      message: error.message || fallbackMessage,
    },
    { status: error.statusCode || 500 }
  );
}

export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (auth.response) return auth.response;

    const data = await getTodayAttendance(auth.user);
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return errorResponse(error, "Failed to fetch attendance.");
  }
}

export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (auth.response) return auth.response;

    const attendance = await punchIn(auth.user);
    return NextResponse.json(
      { success: true, message: "Punch-in recorded.", attendance },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error, "Punch-in failed.");
  }
}

export async function PUT(request) {
  try {
    const auth = await authenticate(request);
    if (auth.response) return auth.response;

    const attendance = await punchOut(auth.user);
    return NextResponse.json({
      success: true,
      message: "Punch-out recorded.",
      attendance,
    });
  } catch (error) {
    return errorResponse(error, "Punch-out failed.");
  }
}
