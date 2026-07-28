import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createDesignationService(designationData) {
  try {
    const designation = await prisma.designation.create({
      data: {
        name: designationData.name,
        title: designationData.title,
        departmentId: designationData.departmentId,
      },
    });

    return designation;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const customError = new Error("Designation already exists");

      customError.statusCode = 409;

      throw customError;
    }

    throw error;
  }
}

export async function getDesignationService() {
  const designations = await prisma.designation.findMany({
    include: {
      department: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return designations;
}

export async function deleteDesignationService(id) {
  try {
    const deletedDesignation = await prisma.designation.delete({
      where: {
        id,
      },
    });

    return deletedDesignation;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      const customError = new Error("Designation doesn't exist");

      customError.statusCode = 404;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      const customError = new Error("Designation cannot be deleted because related records exist.");

      customError.statusCode = 409;

      throw customError;
    }

    throw error;
  }
}