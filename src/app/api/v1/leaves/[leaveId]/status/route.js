import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import { updateLeaveStatusController } from "@/controllers/leave/leaveStatus.controller";

export async function PATCH(request, { params }) {
    try {
        const auth = await requireAuth(request, ["ADMIN"]);

        if(!auth.success) {

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

        const result = await updateLeaveStatusController(body, params.leaveId, auth.user);

        return NextResponse.json(
            result,
            {
                status: 200,
            }
        );
    } catch (error) {
        
        console.error("Update Leave Status Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message  || "Internal Server Error",
                errors: error.errors || {},
            },
            {
                status: error.statusCode || 500,
            }
        )
    }
}