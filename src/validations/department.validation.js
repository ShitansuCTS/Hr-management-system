import { z } from "zod";

const createDepartmentSchema = z.object({
  departmentName: z
    .string()
    .trim()
    .min(1, "Department name is required")
    .max(25, "Department name must be less than 25 characters")
    .regex(
      /^[A-Za-z].*/,
      "Department name must start with an alphabet letter",
    ),
});

export function validateCreateDepartment(body) {
  const result = createDepartmentSchema.safeParse(body);

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