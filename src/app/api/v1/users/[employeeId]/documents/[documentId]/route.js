export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";

import { getSingleDocumentController } from "@/controllers/user/document/uploadDocument.controller";
import { deleteDocumentController } from "@/controllers/user/document/deleteDocument.controller";

export async function GET(request, { params }) {
  try {
    const auth = await requireAuth(request, ["ADMIN", "EMPLOYEE"]);

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        }
      );
    }

    const { employeeId, documentId } = await params;

    if (!employeeId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is required.",
          errors: {},
        },
        {
          status: 400,
        }
      );
    }

    if (!documentId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Document ID is required.",
          errors: {},
        },
        {
          status: 400,
        }
      );
    }

    const result = await getSingleDocumentController(
      employeeId.trim(),
      documentId.trim(),
      auth.user
    );

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Get Document Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch document.",
        errors: error.errors || {},
      },
      {
        status: error.statusCode || 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await requireAuth(request, ["ADMIN", "EMPLOYEE"]);

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        }
      );
    }

    const { employeeId, documentId } = await params;

    if (!employeeId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is required.",
          errors: {},
        },
        {
          status: 400,
        }
      );
    }

    if (!documentId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Document ID is required.",
          errors: {},
        },
        {
          status: 400,
        }
      );
    }

    const result = await deleteDocumentController(employeeId.trim(), documentId.trim(), auth.user);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Delete Document Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete document.",
        errors: error.errors || {},
      },
      {
        status: error.statusCode || 500,
      }
    );
  }
}
