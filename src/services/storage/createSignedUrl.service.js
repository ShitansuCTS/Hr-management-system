import { supabaseAdmin } from "@/lib/supabase";

export async function createSignedUrl({ bucket, storagePath, expiresIn = 300 }) {
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

    const { data, error: signedUrlError } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(storagePath, expiresIn);

    if (signedUrlError) {
      console.error("Supabase signed URL error:", signedUrlError);

      const error = new Error("Failed to generate document access URL.");

      error.statusCode = 500;

      throw error;
    }

    return {
      signedUrl: data.signedUrl,
      expiresIn,
    };
  } catch (error) {
    console.error("Create Signed URL Service Error:", error);

    if (error.statusCode) {
      throw error;
    }

    const customError = new Error("Failed to generate document access URL.");

    customError.statusCode = 500;

    throw customError;
  }
}
