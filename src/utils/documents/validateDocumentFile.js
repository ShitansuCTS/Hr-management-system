const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg"];

function detectFileType(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    return null;
  }

  if (buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "%PDF-") {
    return {
      mimeType: "application/pdf",
      extension: "pdf",
    };
  }

  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return {
      mimeType: "image/jpeg",
      extension: "jpg",
    };
  }

  return null;
}

export function validateDocumentFile(file, buffer) {
  if (!file) {
    const error = new Error("File is required.");
    error.statusCode = 400;

    throw error;
  }

  if (file.size <= 0) {
    const error = new Error("File cannot be empty.");
    error.statusCode = 400;

    throw error;
  }

  if (file.size > MAX_FILE_SIZE) {
    const error = new Error("File size must not exceed 1 MB.");

    error.statusCode = 400;

    throw error;
  }

  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    const error = new Error("Invalid file content.");
    error.statusCode = 400;

    throw error;
  }

  const detectedFile = detectFileType(buffer);

  if (!detectedFile) {
    const error = new Error("Only PDF and JPG/JPEG files are allowed.");

    error.statusCode = 400;

    throw error;
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    const error = new Error("Only PDF and JPG/JPEG files are allowed.");

    error.statusCode = 400;

    throw error;
  }

  if (file.type !== detectedFile.mimeType) {
    const error = new Error("File content does not match the declared file type.");

    error.statusCode = 400;

    throw error;
  }

  return {
    mimeType: detectedFile.mimeType,
    extension: detectedFile.extension,
    size: file.size,
  };
}
