import { supabaseAdmin } from "@/lib/supabase";

export async function deleteFile({ bucket, storagePath }) {
  try {
    if (!bucket) {
      const error = new Error("Storage bucket is required.");
      error.statusCode = 500;
      throw error;
    }

    if (!storagePath) {
      const error = new Error("Storage path is required.");
      error.statusCode = 500;
      throw error;
    }

    const { error: deleteError } = await supabaseAdmin.storage.from(bucket).remove([storagePath]);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);

      const error = new Error("Failed to delete uploaded file.");

      error.statusCode = 500;

      throw error;
    }

    return {
      bucket,
      storagePath,
      deleted: true,
    };
  } catch (error) {
    console.error("Supabase Storage Delete Error:", error);

    if (error.statusCode) {
      throw error;
    }

    const customError = new Error("Failed to delete file.");

    customError.statusCode = 500;

    throw customError;
  }
}
