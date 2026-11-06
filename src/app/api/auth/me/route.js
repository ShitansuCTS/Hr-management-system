
import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";

export const dynamic = "force-dynamic";

export async function GET(req) {
    const auth = await requireAuth(req);

    if (!auth.success) {
        return NextResponse.json({ user: null }, { status: auth.status });
    }

    return NextResponse.json({
        user: {
            id: auth.user.id,
            role: auth.user.role,
        },
    });
}