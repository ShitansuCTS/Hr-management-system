import { PrismaClient } from "../../../../lib/generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { organization: true },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        if (user.status !== "ACTIVE") {
            return NextResponse.json(
                { message: "User account is inactive" },
                { status: 403 }
            );
        }

        // ✅ Compare hashed password (matches signup)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // ✅ Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
                organizationId: user.organizationId,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const res = NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });

        // ✅ Secure cookie
        res.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return res;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
