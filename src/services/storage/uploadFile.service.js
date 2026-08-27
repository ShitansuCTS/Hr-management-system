import { supabaseAdmin } from "@/lib/supabase";

export async function uploadFile({
  bucket,
  folder,
  fileName,
  buffer,
  contentType,
  expiresIn = null,
}) {
  try {
    /*
    ==========================================
        Validate Input
    ==========================================
    */

    if (!bucket) {
      const error = new Error("Storage bucket is required.");
      error.statusCode = 500;
      throw error;
    }

    if (!folder) {
      const error = new Error("Storage folder is required.");
      error.statusCode = 500;
      throw error;
    }

    if (!fileName) {
      const error = new Error("Storage file name is required.");
      error.statusCode = 500;
      throw error;
    }

    if (!Buffer.isBuffer(buffer)) {
      const error = new Error("Invalid file buffer.");
      error.statusCode = 500;
      throw error;
    }

    if (!contentType) {
      const error = new Error("Content type is required.");
      error.statusCode = 500;
      throw error;
    }

    /*
    ==========================================
        Storage Path
    ==========================================
    */

    const storagePath = `${folder}/${fileName}`;

    /*
    ==========================================
        Upload
    ==========================================
    */

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);

      const error = new Error("Failed to upload file.");
      error.statusCode = 500;

      throw error;
    }

    /*
    ==========================================
        Optional Signed URL
    ==========================================
    */

    let downloadUrl = null;

    if (expiresIn) {
      const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(storagePath, expiresIn);

      if (signedUrlError) {
        /*
        ------------------------------------------
            Signed URL failed after upload
            Clean up uploaded object
        ------------------------------------------
        */

        try {
          await deleteFile({
            bucket,
            storagePath,
          });
        } catch (cleanupError) {
          console.error("Failed to cleanup file after signed URL failure:", cleanupError);
        }

        console.error("Supabase signed URL error:", signedUrlError);

        const error = new Error("Failed to generate file access URL.");

        error.statusCode = 500;

        throw error;
      }

      downloadUrl = signedUrlData?.signedUrl || null;
    }

    /*
    ==========================================
        Return Storage Information
    ==========================================
    */

    return {
      bucket,
      storagePath,
      fileName,
      contentType,
      downloadUrl,
    };
  } catch (error) {
    console.error("Supabase Storage Upload Error:", error);

    if (error.statusCode) {
      throw error;
    }

    const customError = new Error("Failed to upload file.");

    customError.statusCode = 500;

    throw customError;
  }
}
