import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
    const token = req.cookies.get("auth_token")?.value;
    const pathname = req.nextUrl.pathname;

    const isLoginPage = pathname === "/authentication/login/minimal";

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL("/authentication/login/minimal", req.url));
    }

    if (token && isLoginPage) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/admin/:path*", "/employee/:path*"],
};
