import { z } from "zod";

const updateLeaveStatusSchema = z.object({
  status: z.enum(
    ["APPROVED", "REJECTED", "PENDING"],
    {
      message: "Invalid leave status",
    }
  ),
});

export function validateLeaveStatus(body) {
  const result =
    updateLeaveStatusSchema.safeParse(body);

  if (!result.success) {

    const errors = {};

    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] =
        issue.message;
    });

    const error =
      new Error("Validation failed");

    error.errors = errors;

    error.statusCode = 400;

    throw error;
  }

  return result.data;
}