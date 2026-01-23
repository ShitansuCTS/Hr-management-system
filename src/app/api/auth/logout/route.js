import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({
        success: true,
        message: "Logged out successfully",
    });

    // Remove JWT cookie
    res.cookies.set("auth_token", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0), // 👈 immediately expire
    });

    return res;
}
