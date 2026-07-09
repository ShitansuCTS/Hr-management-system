import { z } from "zod";

const createLeaveSchema = z
  .object({
    leaveType: z.string().trim().min(1, "Leave type is required"),

    startDate: z.string().min(1, "Start date is required"),

    endDate: z.string().min(1, "End date is required"),

    reason: z
      .string()
      .trim()
      .min(1, "Reason is required")
      .max(500, "Reason cannot exceed 500 characters"),
  })
  .superRefine((data, ctx) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const start = new Date(data.startDate);

    const end = new Date(data.endDate);

    if (isNaN(start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Invalid start date",
      });

      return;
    }

    if (isNaN(end)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Invalid end date",
      });

      return;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start < tomorrow) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Leave can only be applied from tomorrow onwards",
      });
    }

    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date cannot be before start date",
      });
    }
  });

export function validateCreateLeave(body) {
  const result = createLeaveSchema.safeParse(body);

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
