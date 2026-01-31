import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { verifyToken } from "@/lib/jwt";
import { BsGlobeAsiaAustralia } from "react-icons/bs";



const prisma = new PrismaClient();




export async function GET(request) {
    try {

        // 1️⃣ Validate token
        const token = request.cookies.get("auth_token")?.value;
        if (!token)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded)
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });

        const userId = decoded.userId; // make sure your token has userId

        // console.log("The users id is :", userId);

        const leaveBalances = await prisma.leaveBalance.findMany({
            where: { userId },
            select: {
                leaveType: true,
                total: true,
            },
        });

        return NextResponse.json({
            success: true,
            leaveBalances: leaveBalances,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Failed to fetch users",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}