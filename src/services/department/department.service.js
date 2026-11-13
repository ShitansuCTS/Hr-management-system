import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createDepartmentService(currentUser, departmentData) {
  try {
    const department = await prisma.department.create({
      data: {
        name: departmentData.departmentName,
        organizationId: currentUser.organizationId,
      },
    });

    return department;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const customError = new Error("Department already exists");

      customError.statusCode = 409;

      throw customError;
    }

    throw error;
  }
}

export async function getDepartmentService(currentUser) {
  const departments = await prisma.department.findMany({
    where: {
      organizationId: currentUser.organizationId,
      isActive: true,
    },
    orderBy: {
      id: "asc",
    },
    include: {
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  return departments.map((department) => ({
    ...department,
    employeeCount: department._count.users,
    _count: undefined,
  }));
}

export async function deleteDepartmentService(currentUser, id) {
  try {
    const deletedDepartment = await prisma.department.delete({
      where: {
        id,
        organizationId: currentUser.organizationId,
      },
    });

    return deletedDepartment;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      const customError = new Error("Department doesn't exist");

      customError.statusCode = 404;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      const customError = new Error("Department cannot be deleted because related records exist.");

      customError.statusCode = 409;

      throw customError;
    }

    throw error;
  }
}
