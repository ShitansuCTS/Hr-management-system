import { parseExcel } from "./parseExcel.service";
import { buildLookupMaps } from "./buildLookupMaps.service";
import { validateEmployeeRow } from "./validateEmployeeRow.service";
import { createBatchObjects } from "./createBatchObjects.service";
import { createEmptyBatch } from "./createEmptyBatch.service";
import { processChunks } from "./processChunks.service";
import { generateErrorReport } from "./generateErrorReport.service";
import { buildImportResponse } from "./buildImportResponse.service";
import { uploadFile } from "@/services/storage/uploadFile.service";
import { getOrganizationBucket } from "@/utils/storage/getOrganizationBucket";

export async function importUsersService(file, currentUser) {
  const organizationId = currentUser.organizationId;

  const { headers, rows } = await parseExcel(file);

  const importedEmailSet = new Set();

  const importedEmployeeIdSet = new Set();

  const lookupMaps = await buildLookupMaps(currentUser);

  const batch = createEmptyBatch();

  const failedRows = [];

  for (let index = 0; index < rows.length; index++) {
    batch.statistics.processed++;

    try {
      const result = await validateEmployeeRow(
        rows[index],
        rows[index].excelRow,
        lookupMaps,
        importedEmailSet,
        importedEmployeeIdSet
      );

      if (!result.success) {
        batch.statistics.failed++;

        failedRows.push({
          excelRow: rows[index].excelRow,
          originalRow: rows[index],
          errors: result.errors ?? [result.error],
        });

        continue;
      }

      const currentYear = new Date().getFullYear();

      await createBatchObjects(
        {
          ...result.employee,
          excelRow: rows[index].excelRow,
          sourceRow: rows[index],
        },
        currentUser,
        batch,
        currentYear
      );
    } catch (error) {
      batch.statistics.failed++;

      console.error(error);

      failedRows.push({
        excelRow: rows[index].excelRow,
        originalRow: rows[index],
        errors: [
          {
            row: rows[index].excelRow,
            field: "SYSTEM",
            value: null,
            message: error.message,
          },
        ],
      });
    }
  }

  if (batch.data.employees.length > 0) {
    const persistenceFailures = await processChunks(batch, currentUser.organizationId);
    failedRows.push(...persistenceFailures);
  }

  let errorReport = null;

  if (failedRows.length > 0) {
    const report = await generateErrorReport({
      headers,
      failedRows,
    });

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const bucket = getOrganizationBucket(organizationId);

    const folder = `import-errors/${year}/${month}`;

    const uploadedReport = await uploadFile({
      bucket,

      folder,

      fileName: report.fileName,

      buffer: report.buffer,

      contentType: report.contentType,

      expiresIn: 3600,
    });

    errorReport = {
      fileName: uploadedReport.fileName,

      downloadUrl: uploadedReport.downloadUrl,

      expiresIn: 3600,
    };
  }

  const response = buildImportResponse({
    totalRows: rows.length,

    processed: batch.statistics.processed,

    inserted: batch.statistics.inserted,

    failed: batch.statistics.failed,

    skipped: batch.statistics.skipped,

    errorReport,
  });

  return response;
}
