import { z } from "zod";

const createUserDocumentSchema = z.object({
  documentType: z
    .string()
    .trim()
    .min(1, "Document type is required.")
    .max(50, "Document type must not exceed 50 characters."),

  documentName: z
    .string()
    .trim()
    .min(1, "Document name is required.")
    .max(255, "Document name must not exceed 255 characters."),
});

export function validateCreateUserDocument(data) {
  const result = createUserDocumentSchema.safeParse(data);

  if (!result.success) {
    const errors = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0];

      errors[field] = issue.message;
    });

    const error = new Error("Validation failed.");

    error.errors = errors;
    error.statusCode = 400;

    throw error;
  }

  return result.data;
}
