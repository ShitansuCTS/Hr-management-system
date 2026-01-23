import { PrismaClient } from '../../../../lib/generated/prisma';
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();


export async function POST(req) {
    const { email, password, organizationId } = await req.json();

    if (!email || !password || !organizationId) {
        return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
        );
    }

    // check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return NextResponse.json(
            { message: "User already exists" },
            { status: 409 }
        );
    }

    // hash password (recommended)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: "EMPLOYEE",          // 👈 default role
            status: "ACTIVE",
            organizationId,            // 👈 required by schema
        },
    });

    return NextResponse.json({
        success: true,
        message: "User created successfully",
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    });
}
