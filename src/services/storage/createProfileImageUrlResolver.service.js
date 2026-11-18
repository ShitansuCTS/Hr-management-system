import { createSignedUrl } from "@/services/storage/createSignedUrl.service";
import { getOrganizationBucket } from "@/utils/storage/getOrganizationBucket";

export function createProfileImageUrlResolver(organizationId, logMessage) {
  const bucket = getOrganizationBucket(organizationId);
  const imageUrlCache = new Map();

  return async (imagePath, logContext = {}) => {
    if (typeof imagePath !== "string" || !imagePath.trim()) {
      return null;
    }

    const storagePath = imagePath.replace(/[\r\n]/g, "").trim();

    if (!storagePath) {
      return null;
    }

    try {
      if (!imageUrlCache.has(storagePath)) {
        imageUrlCache.set(
          storagePath,
          createSignedUrl({
            bucket,
            storagePath,
            expiresIn: 300,
          }).then(({ signedUrl }) => signedUrl)
        );
      }

      return await imageUrlCache.get(storagePath);
    } catch (error) {
      imageUrlCache.delete(storagePath);
      console.error(logMessage, {
        organizationId,
        storagePath,
        ...logContext,
        message: error.message,
      });
      return null;
    }
  };
}
