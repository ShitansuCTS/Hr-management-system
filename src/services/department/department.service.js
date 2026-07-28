import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createDepartmentService(departmentData) {
  try {
    const department = await prisma.department.create({
      data: {
        name: departmentData.departmentName,
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

export async function getDepartmentService() {
  const departments = await prisma.department.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return departments;
}

export async function deleteDepartmentService(id) {
  try {
    const deletedDepartment = await prisma.department.delete({
      where: {
        id,
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
