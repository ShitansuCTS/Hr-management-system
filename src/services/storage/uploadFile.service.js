import { supabaseAdmin } from "@/lib/supabase";

export async function uploadFile({
  bucket,
  folder,
  fileName,
  buffer,
  contentType,
  expiresIn = 3600,
}) {
  try {
    const storagePath = `${folder}/${fileName}`;

    /*
    ==========================================
        Upload File
    ==========================================
    */

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    /*
    ==========================================
        Generate Signed URL
    ==========================================
    */

    const { data, error: signedUrlError } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(storagePath, expiresIn);

    if (signedUrlError) {
      throw new Error(signedUrlError.message);
    }

    return {
      fileName,
      bucket,
      storagePath,
      downloadUrl: data.signedUrl,
    };
  } catch (error) {
    console.error("Supabase Storage:", error);

    console.error("Error message:", error.message);
    throw new Error("Failed to upload import report.");
  }
}
