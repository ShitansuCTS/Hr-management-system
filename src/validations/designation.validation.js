import { z } from "zod";

const createDesignationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Designation name is required")
    .max(25, "Designation name must be less than 25 characters")
    .regex(
      /^[A-Za-z].*/,
      "Designation name must start with an alphabet letter",
    ),

  title: z
    .string()
    .trim()
    .min(1, "Designation title is required")
    .max(25, "Designation title must be less than 25 characters")
    .regex(
      /^[A-Za-z].*/,
      "Designation title must start with an alphabet letter",
    ),

  departmentId: z
    .string()
    .trim()
    .min(1, "Department is required"),
});

export function validateCreateDesignation(body) {
  const designationData = {
    name: body.name,
    title: body.title,
    departmentId: body.departmentId,
  };

  const result =
    createDesignationSchema.safeParse(
      designationData,
    );

  if (!result.success) {
    const errors = {};

    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });

    const error = new Error("Validation failed");

    error.errors = errors;

    error.statusCode = 400;

    throw error;
  }

  return result.data;
}