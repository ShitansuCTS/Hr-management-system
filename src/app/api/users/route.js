import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        // Fetch all users with their organization info
        const users = await prisma.user.findMany({
            include: {
                organization: true,
            },
        });

        return NextResponse.json({ success: true, users: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Failed to fetch users" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}



