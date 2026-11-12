import { prisma } from "@/lib/prisma";

export async function getEmployeeLeaveStatusService(employeeId, currentUser) {
    const targetUser = await prisma.user.findFirst({
        where: {
            employeeId: employeeId?.trim(),
            organizationId: currentUser.organizationId,
            isDeleted: false,
            role: {
                in: ["ADMIN", "EMPLOYEE"],
            },
        },
        select: {
            id: true,
            employeeId: true,
            fullName: true,
        },
    });

    if (!targetUser) {
        const error = new Error("Employee not found.");
        error.statusCode = 404;
        throw error;
    }

    // Employees can only access their own leave records.
    if (
        currentUser.role === "EMPLOYEE" &&
        currentUser.id !== targetUser.id
    ) {
        const error = new Error("You cannot view another employee's leave records.");
        error.statusCode = 403;
        throw error;
    }

    const leaves = await prisma.leaveApplication.findMany({
        where: {
            userId: targetUser.id,
            organizationId: currentUser.organizationId,
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
            id: true,
            leaveType: true,
            startDate: true,
            endDate: true,
            reason: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            comments: {
                orderBy: {
                    createdAt: "asc",
                },
                select: {
                    id: true,
                    message: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            role: true,
                        },
                    },
                },
            },
        },
    });

    const leaveBalances = await prisma.leaveBalance.findMany({
        where: {
            userId: targetUser.id,
            organizationId: currentUser.organizationId,
            year: new Date().getFullYear(),
        },
        select: {
            leaveType: true,
            allocated: true,
            used: true,
            remaining: true,
            year: true,
        },
        orderBy: {
            leaveType: "asc",
        },
    });

    return {
        employee: targetUser,
        leaves,
        leaveBalances,
    };
}