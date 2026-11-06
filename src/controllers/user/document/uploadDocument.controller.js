import { validateCreateUserDocument } from "@/validations/userDocument.validation";
import { validateDocumentFile } from "@/utils/documents/validateDocumentFile";
import { uploadDocumentService } from "@/services/user/document/uploadDocument.service";
import { getDocumentsService } from "@/services/user/document/getDocuments.service";
import { getSingleDocumentService } from "@/services/user/document/getSingleDocument.service";

export async function uploadDocumentController(request, employeeId, currentUser) {
  const formData = await request.formData();

  const documentType = formData.get("documentType");
  const documentName = formData.get("documentName");
  const file = formData.get("file");

  const validatedData = validateCreateUserDocument({
    documentType,
    documentName,
  });

  if (!(file instanceof File)) {
    const error = new Error("File is required.");

    error.statusCode = 400;

    throw error;
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const validatedFile = validateDocumentFile(file, buffer);

  const document = await uploadDocumentService({
    employeeId,
    currentUser,
    document: validatedData,
    file: {
      buffer,
      mimeType: validatedFile.mimeType,
      extension: validatedFile.extension,
      size: validatedFile.size,
    },
  });

  return {
    success: true,
    message: "Document uploaded successfully.",
    data: document,
  };
}

export async function getDocumentsController(employeeId, currentUser) {
  const documents = await getDocumentsService(employeeId, currentUser);

  return {
    success: true,
    message: "Documents fetched successfully.",
    data: documents,
  };
}

export async function getSingleDocumentController(employeeId, documentId, currentUser) {
  const document = await getSingleDocumentService(employeeId, documentId, currentUser);

  return {
    success: true,
    message: "Document fetched successfully.",
    data: document,
  };
}
