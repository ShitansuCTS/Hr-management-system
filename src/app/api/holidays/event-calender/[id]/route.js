import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function DELETE(request, { params }) {
    try {
        // 1️⃣ Validate token
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                { status: 401 }
            );
        }

        // ✅ Get ID from route params
        const eventId = params.id;

        console.log("Event ID:", eventId);

        if (!eventId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event ID is required",
                },
                { status: 400 }
            );
        }


        // 3️⃣ Check event belongs to organization
        const existingEvent = await prisma.calendarEvent.findFirst({
            where: {
                id: eventId,
                organizationId: decoded.organizationId,
                isDeleted: false,
            },
        });


        if (!existingEvent) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event not found",
                },
                { status: 404 }
            );
        }


        // 4️⃣ Soft delete event
        await prisma.calendarEvent.update({
            where: {
                id: eventId,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedById: decoded.userId,
            },
        });


        return NextResponse.json(
            {
                success: true,
                message: "Calendar event deleted successfully",
            },
            { status: 200 }
        );


    } catch (error) {
        console.error("Delete calendar event error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to delete calendar event",
            },
            { status: 500 }
        );
    }
}