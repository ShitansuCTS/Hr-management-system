import { prisma } from "@/lib/prisma";

export async function getEmployeeActivityService(employeeId, currentUser) {
  const targetUser = await prisma.user.findFirst({
    where: {
      employeeId: employeeId?.trim(),
      organizationId: currentUser.organizationId,
      isDeleted: false,
    },
    select: { id: true },
  });

  if (!targetUser) {
    const error = new Error("Employee not found.");
    error.statusCode = 404;
    throw error;
  }

  if (currentUser.role === "EMPLOYEE" && currentUser.id !== targetUser.id) {
    const error = new Error("You cannot view this employee's activity.");
    error.statusCode = 403;
    throw error;
  }

  return prisma.userActivity.findMany({
    where: {
      userId: targetUser.id,
      organizationId: currentUser.organizationId,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      action: true,
      description: true,
      createdAt: true,
    },
  });
}
