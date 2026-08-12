import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createDesignationService(currentUser, designationData) {
  try {
    const organizationId = currentUser.organizationId;

    const department = await prisma.department.findFirst({
      where: {
        id: designationData.departmentId,
        organizationId,
        isActive: true,
      },
    });

    if (!department) {
      const error = new Error("Department not found.");

      error.statusCode = 404;

      throw error;
    }

    console.log("name",designationData.name);
    console.log("fulldata",designationData);
    

    const designation = await prisma.designation.create({
      data: {
        name: designationData.name,
        departmentId: department.id,
        organizationId,
      },
      include: {
        department: true,
      },
    });

    return designation;
  } catch (error) {
    if (error.statusCode && error.message) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const customError = new Error("Designation already exists in this department.");

        customError.statusCode = 409;

        throw customError;
      }

      if (error.code === "P2003") {
        const customError = new Error("Invalid department.");

        customError.statusCode = 400;

        throw customError;
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const customError = new Error("Database validation failed.");

      customError.statusCode = 500;

      throw customError;
    }

    console.error("Create Designation Service Error:", error);

    throw error;
  }
}

export async function getDesignationService(currentUser) {
  try {
    const organizationId = currentUser.organizationId;

    const designations = await prisma.designation.findMany({
      where: {
        organizationId,
      },

      include: {
        department: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return designations;
  } catch (error) {
    console.error("Get Designations Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const customError = new Error("Database operation failed.");

      customError.statusCode = 500;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const customError = new Error("Database validation failed.");

      customError.statusCode = 500;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      const customError = new Error("Database connection failed.");

      customError.statusCode = 500;

      throw customError;
    }

    throw error;
  }
}

export async function deleteDesignationService(currentUser, id) {
  try {
    const organizationId = currentUser.organizationId;

    const designation = await prisma.designation.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!designation) {
      const error = new Error("Designation doesn't exist.");

      error.statusCode = 404;

      throw error;
    }

    const deletedDesignation = await prisma.designation.delete({
      where: {
        id: designation.id,
      },
    });

    return deletedDesignation;
  } catch (error) {
    if (error.statusCode && error.message) {
      throw error;
    }

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
