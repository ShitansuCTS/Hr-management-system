import { NextResponse } from 'next/server';
import { PrismaClient, Role } from '../../../lib/generated/prisma';
import bcrypt from 'bcryptjs';
import { verifyToken } from "@/lib/jwt";



const prisma = new PrismaClient();


export async function POST(request) {
    try {
        const data = await request.json();

        console.log("Received user data:", data);

        // 🔐 Default password
        const hashedPassword = await bcrypt.hash("1111", 10);

        const newUser = await prisma.user.create({
            data: {
                // =====================
                // Auth
                // =====================
                email: data.email,
                password: hashedPassword,
                role: Role.EMPLOYEE,

                // =====================
                // Employee Core
                // =====================
                employeeId: data.employeeId,
                fullName: data.fullName,
                phone: data.phone,
                designation: data.designation,
                department: data.department || null,
                employmentType: data.employmentType || null,
                workLocation: data.workLocation || null,
                dateOfJoining: new Date(data.dateOfJoining),

                // =====================
                // Personal Details
                // =====================
                gender: data.gender || null,
                dateOfBirth: data.dateOfBirth
                    ? new Date(data.dateOfBirth)
                    : null,
                fatherName: data.fatherName || null,
                motherName: data.motherName || null,

                // =====================
                // Address
                // =====================
                currentAddress: data.currentAddress || null,
                permanentAddress: data.permanentAddress || null,
                city: data.city || null,
                state: data.state || null,
                country: data.country || null,
                pincode: data.pincode || null,

                // =====================
                // Emergency Contact
                // =====================
                emergencyContactName: data.emergencyContactName || null,
                emergencyContactPhone: data.emergencyContactPhone || null,
                emergencyContactRelation: data.emergencyContactRelation || null,

                // =====================
                // Reporting Manager
                // =====================
                reportingManagerName: data.reportingManagerName || null,

                // =====================
                // Organization
                // =====================
                organizationId: "ctsl_2026",
            },
        });

        console.log("New user created:", newUser);

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            userId: newUser.id,
        });
    } catch (error) {
        console.error("Create user error:", error);

        // Prisma unique constraint error
        if (error.code === "P2002") {
            const target = error.meta?.target || [];

            let message = "Duplicate entry";

            if (target.includes("email")) {
                message = "Email already exists";
            } else if (target.includes("employeeId")) {
                message = "Employee ID already exists";
            } else if (target.includes("employeeId") && target.includes("organizationId")) {
                message = "Employee ID already exists in this organization";
            }

            return NextResponse.json(
                { success: false, message },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, message: error.message || "Failed to create user" },
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

