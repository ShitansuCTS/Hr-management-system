import { requireAuth } from "@/auth/requireAuth";
import { NextResponse } from "next/server";
import { getEmployeeLeaveStatusController } from "@/controllers/leave/employeeLeaveStatus.controller";

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

        const { employeeId } = await params;

        const result = await getEmployeeLeaveStatusController(
            employeeId,
            auth.user
        );

        return NextResponse.json(result, {
            status: 200,
        });
    } catch (error) {
        console.error("Get Employee Leave Status Route Error:", error);

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