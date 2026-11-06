-- Keep existing Cloudinary references while adding support for Supabase storage.
ALTER TABLE "UserDocument"
  ADD COLUMN "mimeType" TEXT,
  ADD COLUMN "storagePath" TEXT,
  ADD COLUMN "uploadedById" TEXT,
  ALTER COLUMN "fileUrl" DROP NOT NULL;

UPDATE "UserDocument"
SET "mimeType" = "fileType"
WHERE "mimeType" IS NULL;

-- CreateIndex
CREATE INDEX "UserDocument_uploadedById_idx" ON "UserDocument"("uploadedById");

-- CreateIndex
CREATE UNIQUE INDEX "UserDocument_organizationId_userId_documentType_key" ON "UserDocument"("organizationId", "userId", "documentType");

-- AddForeignKey
ALTER TABLE "UserDocument"
  ADD CONSTRAINT "UserDocument_uploadedById_fkey"
  FOREIGN KEY ("uploadedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
