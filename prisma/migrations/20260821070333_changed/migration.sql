-- Existing documents do not have a known file size; keep it nullable until populated.
ALTER TABLE "UserDocument"
  ADD COLUMN "fileSize" INTEGER;
