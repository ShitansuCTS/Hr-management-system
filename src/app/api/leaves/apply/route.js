import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        // 🔐 Auth
        const token = request.cookies.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded?.userId) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const userId = decoded.userId;

        // 📩 Request body
        const { leaveType, startDate, endDate, reason } = await request.json();

        // ✅ Validation 1
        if (!leaveType || !startDate || !endDate || !reason) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // ✅ Validation 2
        if (isNaN(start) || isNaN(end) || end < start) {
            return NextResponse.json({ message: "Invalid date range" }, { status: 400 });
        }

        // 📅 Calculate days
        const dayCount =
            Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // 🔍 Fetch leave balance
        const leaveBalance = await prisma.leaveBalance.findUnique({
            where: {
                userId_leaveType: {
                    userId,
                    leaveType,
                },
            },
        });

        if (!leaveBalance) {
            return NextResponse.json(
                { message: "Leave type not assigned to user" },
                { status: 400 }
            );
        }

        if (dayCount > leaveBalance.total) {
            return NextResponse.json(
                { message: "Insufficient leave balance" },
                { status: 400 }
            );
        }

        // 🔥 Transaction
        const [application] = await prisma.$transaction([
            prisma.leaveApplication.create({
                data: {
                    userId,
                    leaveType,
                    startDate: start,
                    endDate: end,
                    reason,
                    status: "PENDING",
                },
            }),
            prisma.leaveBalance.update({
                where: {
                    userId_leaveType: {
                        userId,
                        leaveType,
                    },
                },
                data: {
                    total: { decrement: dayCount },
                },
            }),
        ]);

        return NextResponse.json(
            {
                success: true,
                message: "Leave applied successfully",
                application,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error applying leave:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
