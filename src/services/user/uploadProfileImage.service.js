import { randomUUID } from "crypto";

import { uploadFile } from "@/services/storage/uploadFile.service";
import { getOrganizationBucket } from "@/utils/storage/getOrganizationBucket";

export async function uploadProfileImage(file, currentUser, employeeId) {
  try {
    if (!file || file.size === 0) {
      return null;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extension = "jpg";

    if (file.type === "image/png") {
      extension = "png";
    }

    const bucket = getOrganizationBucket(currentUser.organizationId);

    const safeEmployeeId = employeeId.trim().replace(/[^A-Za-z0-9_-]/g, "_");

    const fileName = `${randomUUID()}.${extension}`;

    const folder = `profile-images/${safeEmployeeId}`;

    const uploadedFile = await uploadFile({
      bucket,
      folder,
      fileName,
      buffer,
      contentType: file.type,
    });

    return {
      bucket: uploadedFile.bucket,
      storagePath: uploadedFile.storagePath,
    };
  } catch (error) {
    console.error("Upload Profile Image Service Error:", error);

    if (error.statusCode) {
      throw error;
    }

    const customError = new Error("Failed to upload profile image.");

    customError.statusCode = 500;

    throw customError;
  }
}
