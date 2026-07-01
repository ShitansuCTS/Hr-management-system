import { z } from "zod";

const createAnnouncementSchema = z
  .object({
    subject: z
      .string()
      .trim()
      .min(1, "Subject is required")
      .max(50, "Subject must not exceed 50 characters"),

    mailBody: z
      .string()
      .trim()
      .min(1, "Mail body is required")
      .max(1000, "Mail body must not exceed 1000 characters"),

    sendType: z.enum(["ALL", "INDIVIDUAL"], {
      message: "Invalid send type",
    }),

    emails: z.array(z.string().trim().email("Invalid email address")).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sendType === "INDIVIDUAL" && (!data.emails || data.emails.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emails"],
        message: "Please select at least one user",
      });
    }
  });

export function validateCreateAnnouncement(body) {
  const result = createAnnouncementSchema.safeParse(body);

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
