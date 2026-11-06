import { importUsersService } from "@/services/user/import-users/importUsers.service";
import { NextResponse } from "next/server";

export async function importUsersController(request, currentUser) {
  const formData = await request.formData();

  const file = formData.get("file");

  if (!file || typeof file.arrayBuffer !== "function") {
    const error = new Error("An Excel .xlsx file is required.");

    error.statusCode = 400;

    throw error;
  }

  if (!file.name?.toLowerCase().endsWith(".xlsx")) {
    const error = new Error("Only .xlsx Excel files are supported.");
    error.statusCode = 400;
    throw error;
  }

  if (file.size > 10 * 1024 * 1024) {
    const error = new Error("Excel file must be 10 MB or smaller.");
    error.statusCode = 400;
    throw error;
  }

  const response = await importUsersService(file, currentUser);

  return response;
}
