export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import {
  uploadDocumentController,
  getDocumentsController,
} from "@/controllers/user/document/uploadDocument.controller";

export async function POST(request, { params }) {
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

    const { employeeId } = await params;

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

    const result = await uploadDocumentController(request, employeeId.trim(), auth.user);

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("Upload Document Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Document upload failed.",
        errors: error.errors || {},
      },
      {
        status: error.statusCode || 500,
      }
    );
  }
}

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

    const { employeeId } = await params;

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

    const result = await getDocumentsController(employeeId.trim(), auth.user);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("Get Documents Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch documents.",
        errors: error.errors || {},
      },
      {
        status: error.statusCode || 500,
      }
    );
  }
}
