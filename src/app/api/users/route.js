import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '../../../lib/generated/prisma';
import bcrypt from 'bcryptjs';
import { verifyToken } from "@/lib/jwt";



const prisma = new PrismaClient();





// POST request: receive form data and log it
export async function POST(request) {
    try {
        const data = await request.json(); // Get JSON body from frontend

        console.log("Received new user data:", data);

        const joiningDate = new Date(data.dateOfJoining);
        const organizationId = "ctsl_2026";

        // Hash password (recommended)
        const hashedPassword = await bcrypt.hash("1111", 10);

        // Build the object to match Prisma User model
        const newUserData = {
            email: data.email,
            password: hashedPassword,           // default password
            role: Role.EMPLOYEE,        // enum Role
            employeeId: data.employeeId,
            fullName: data.name,        // map frontend "name" to fullName
            phone: data.phone,
            designation: data.designation,
            dateOfJoining: joiningDate,
            organizationId,             // required
        };

        // Create user
        const newUser = await prisma.user.create({
            data: newUserData,
        });

        return NextResponse.json({
            success: true,
            message: "User data received",
            newUser, // echo back the data
        });
    } catch (error) {
        console.error("Error handling POST request:", error);
        return NextResponse.json(
            { success: false, error: "Failed to receive user data" },
            { status: 500 }
        );
    }
}










export async function GET(request) {
    try {

        // 1️⃣ Validate token
        const token = request.cookies.get("auth_token")?.value;
        if (!token)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded)
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });






        const users = await prisma.user.findMany({
            include: {
                organization: true,
            },
        });

        return NextResponse.json({
            success: true,
            users: users,
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

