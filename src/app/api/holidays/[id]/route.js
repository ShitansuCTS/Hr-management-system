import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

const getDateOnly = (value) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
};

/* ==========================================================
   UPDATE HOLIDAY
========================================================== */

export async function PUT(request, { params }) {
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

        if (decoded.role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Access denied.",
                },
                { status: 403 }
            );
        }

        const { id } = params;

        const body = await request.json();

        const holiday = await prisma.holiday.findFirst({
            where: {
                id,
                organizationId: decoded.organizationId,
                isDeleted: false,
            },
        });

        if (!holiday) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Holiday not found.",
                },
                { status: 404 }
            );
        }

        const holidayDate = getDateOnly(body.date);

        if (!holidayDate) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid holiday date.",
                },
                { status: 400 }
            );
        }

        // Check duplicate holiday date
        const duplicate = await prisma.holiday.findFirst({
            where: {
                id: {
                    not: id,
                },
                organizationId: decoded.organizationId,
                date: holidayDate,
                isDeleted: false,
            },
        });

        if (duplicate) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Another holiday already exists on this date.",
                },
                { status: 409 }
            );
        }

        const updatedHoliday = await prisma.holiday.update({
            where: {
                id,
            },
            data: {
                name: body.name.trim(),
                date: holidayDate,
                day: holidayDate.toLocaleDateString("en-IN", {
                    weekday: "long",
                    timeZone: "UTC",
                }),
                year: holidayDate.getUTCFullYear(),
                type: body.type,
                description: body.description || null,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Holiday updated successfully.",
                holiday: updatedHoliday,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update Holiday Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to update holiday.",
            },
            { status: 500 }
        );
    }
}

/* ==========================================================
   DELETE HOLIDAY
========================================================== */

export async function DELETE(request, { params }) {
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

        if (decoded.role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Access denied.",
                },
                { status: 403 }
            );
        }

        const { id } = params;



        const holiday = await prisma.holiday.findFirst({
            where: {
                id,
                organizationId: decoded.organizationId,
                isDeleted: false,
            },
        });



        if (!holiday) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Holiday not found.",
                },
                { status: 404 }
            );
        }

        await prisma.holiday.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Holiday deleted successfully.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete Holiday Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to delete holiday.",
            },
            { status: 500 }
        );
    }
}