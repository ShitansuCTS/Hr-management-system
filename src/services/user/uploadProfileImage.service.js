import cloudinary from "@/lib/cloudinary";

export async function uploadProfileImage(file) {
  if (!file || file.size === 0) {
    return {
      profileImageUrl: null,
      profileImagePublicId: null,
    };
  }

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "hrms/profile-images",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });

  return {
    profileImageUrl: uploadResult.secure_url,

    profileImagePublicId: uploadResult.public_id,
  };
}
