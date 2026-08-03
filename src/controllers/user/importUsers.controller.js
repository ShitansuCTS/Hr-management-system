import { importUsersService } from "@/services/user/import-users/importUsers.service";
import { NextResponse } from "next/server";

export async function importUsersController(request, currentUser) {
  const formData = await request.formData();

  const file = formData.get("file");

  if (!file) {
    const error = new Error("Excel file is required");

    error.statusCode = 400;

    throw error;
  }

  const response = await importUsersService(file, currentUser);

  return response;
}
