import { z } from "zod";

const createLeaveCommentSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(500, "Message cannot exceed 500 characters"),
});

export function validateCreateLeaveComment(body) {
  const result = createLeaveCommentSchema.safeParse(body);

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
