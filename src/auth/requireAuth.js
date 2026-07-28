import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function requireAuth(
    request,
    allowedRoles = []
) {
    try {

        const token =
            request.cookies.get(
                "auth_token"
            )?.value;

        if (!token) {
            return {
                success: false,
                status: 401,
                message: "Unauthorized"
            };
        }

        const decoded =
            verifyToken(token);

        if (!decoded?.userId) {
            return {
                success: false,
                status: 401,
                message: "Invalid token"
            };
        }

        const user =
            await prisma.user.findUnique({
                where: {
                    id: decoded.userId
                },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    organizationId: true
                }
            });

        if (!user) {
            return {
                success: false,
                status: 401,
                message: "User not found"
            };
        }

        if (
            allowedRoles.length > 0 &&
            !allowedRoles.includes(
                user.role
            )
        ) {
            return {
                success: false,
                status: 403,
                message: "Forbidden"
            };
        }

        return {
            success: true,
            user
        };

    } catch (error) {

        console.error(
            "Auth Error:",
            error
        );

        return {
            success: false,
            status: 500,
            message:
                "Internal Server Error"
        };
    }
}