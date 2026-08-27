import { deleteDocumentService } from "@/services/user/document/deleteDocument.service";

export async function deleteDocumentController(employeeId, documentId, currentUser) {
  const document = await deleteDocumentService(employeeId, documentId, currentUser);

  return {
    success: true,
    message: "Document deleted successfully.",
    data: document,
  };
}
