export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import { getEmployeeActivityController } from "@/controllers/user/employeeActivity.controller";

export async function GET(request, { params }) {
  try {
    const auth = await requireAuth(request, ["ADMIN", "EMPLOYEE"]);

    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
    }

    const { employeeId } = await params;
    const result = await getEmployeeActivityController(employeeId, auth.user);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Get Employee Activity Route Error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch activity." },
      { status: error.statusCode || 500 }
    );
  }
}
