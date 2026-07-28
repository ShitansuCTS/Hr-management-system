import { deleteDesignationController } from "@/controllers/designation/designation.controller";
import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";


export async function DELETE(request, { params }) {
  try {
    const auth = await requireAuth(request, ["ADMIN"]);

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

    const { id } = await params;

    const result = await deleteDesignationController(id);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
        errors: error.errors || {},
      },
      {
        status: error.statusCode || 500,
      }
    );
  }
}
