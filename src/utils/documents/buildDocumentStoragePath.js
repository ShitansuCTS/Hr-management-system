import { randomUUID } from "crypto";

export function normalizeDocumentType(documentType) {
  return documentType.trim().replace(/\s+/g, " ").toLowerCase();
}

export function buildDocumentStoragePath({ employeeId, documentType, extension }) {
  const safeEmployeeId = employeeId.trim().replace(/[^A-Za-z0-9_-]/g, "_");

  const safeDocumentType = normalizeDocumentType(documentType).replace(/[^a-z0-9_-]/g, "-");

  const fileName = `${randomUUID()}.${extension}`;

  return {
    folder: `employee-documents/${safeEmployeeId}/${safeDocumentType}`,
    fileName,
  };
}
