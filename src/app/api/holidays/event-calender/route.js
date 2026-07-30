import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(request) {
    try {
        // 1️⃣ Validate token
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);


        console.log("The decode id is ......", decoded)

        if (!decoded) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        // 2️⃣ Get request body
        const data = await request.json();

        console.log("Received calendar event:", data);

        // 3️⃣ Validation
        if (!data.title || !data.startDate) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title and Start Date are required",
                },
                { status: 400 }
            );
        }

        // 4️⃣ Create Event
        const event = await prisma.calendarEvent.create({
            data: {
                title: data.title,
                description: data.description || null,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                allDay: data.allDay ?? true,
                category: data.category || "OTHER",

                createdById: decoded.userId,
                organizationId: decoded.organizationId,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Calendar event created successfully",
                eventId: event.id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create calendar event error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create calendar event",
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
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

        const events = await prisma.calendarEvent.findMany({
            where: {
                organizationId: decoded.organizationId,
                isDeleted: false,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                startDate: "asc",
            },
        });

        return NextResponse.json({
            success: true,
            events,
        });
    } catch (error) {
        console.error("Error fetching calendar events:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch calendar events",
            },
            { status: 500 }
        );
    }
}