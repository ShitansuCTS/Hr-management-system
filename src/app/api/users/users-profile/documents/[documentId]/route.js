export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import { prisma } from "@/lib/prisma";
import { deleteDocumentController } from "@/controllers/user/document/deleteDocument.controller";

export async function DELETE(request, { params }) {
  try {
    const auth = await requireAuth(request, ["ADMIN"]);

    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status }
      );
    }

    const { documentId } = await params;

    if (!documentId?.trim()) {
      return NextResponse.json(
        { success: false, message: "Document ID is required." },
        { status: 400 }
      );
    }

    const document = await prisma.userDocument.findFirst({
      where: {
        id: documentId.trim(),
        organizationId: auth.user.organizationId,
      },
      select: {
        user: {
          select: {
            employeeId: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found." },
        { status: 404 }
      );
    }

    const result = await deleteDocumentController(
      document.user.employeeId,
      documentId.trim(),
      auth.user
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Delete Document Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete document.",
        errors: error.errors || {},
      },
      { status: error.statusCode || 500 }
    );
  }
}
