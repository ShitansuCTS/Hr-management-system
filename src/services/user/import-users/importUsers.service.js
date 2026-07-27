import { parseExcel } from "./parseExcel.service";
import { buildLookupMaps } from "./buildLookupMaps.service";
import { validateEmployeeRow } from "./validateEmployeeRow.service";
import { createBatchObjects } from "./createBatchObjects.service";
import { createEmptyBatch } from "./createEmptyBatch.service";
import { processChunks } from "./processChunks.service";
import { generateErrorReport } from "./generateErrorReport.service";
import { buildImportResponse } from "./buildImportResponse.service";
import { uploadFile } from "@/services/storage/uploadFile.service";

export async function importUsersService(file, currentUser) {
  /*
  ==========================================
      Parse Excel
  ==========================================
  */

  const { headers, rows } = await parseExcel(file);

  /*
  ==========================================
      Duplicate Tracking
  ==========================================
  */

  const importedEmailSet = new Set();

  const importedEmployeeIdSet = new Set();

  /*
  ==========================================
      Database Lookup
  ==========================================
  */

  const lookupMaps = await buildLookupMaps(currentUser.organizationId);

  /*
  ==========================================
      Batch
  ==========================================
  */

  const batch = createEmptyBatch();

  /*
  ==========================================
      Failed Rows
  ==========================================
  */

  const failedRows = [];

  /*
  ==========================================
      Process Rows
  ==========================================
  */

  for (let index = 0; index < rows.length; index++) {
    batch.statistics.processed++;

    try {
      const result = await validateEmployeeRow(
        rows[index],
        index + 2,
        lookupMaps,
        importedEmailSet,
        importedEmployeeIdSet
      );

      if (!result.success) {
        batch.statistics.failed++;

        failedRows.push({
          excelRow: rows[index].excelRow,
          originalRow: rows[index],
          errors: [result.error],
        });

        continue;
      }

      const currentYear = new Date().getFullYear();

      await createBatchObjects(result.employee, currentUser, batch, currentYear);
    } catch (error) {
      batch.statistics.failed++;

      console.error(error);

      failedRows.push({
        excelRow: rows[index].excelRow,
        originalRow: rows[index],
        errors: [
          {
            row: index + 2,
            field: "SYSTEM",
            value: null,
            message: error.message,
          },
        ],
      });
    }
  }

  /*
  ==========================================
      Database Insert
  ==========================================
  */

  if (batch.data.employees.length > 0) {
    await processChunks(batch);
  }

  /*
  ==========================================
      Generate Error Report
  ==========================================
  */

  let errorReport = null;

  if (failedRows.length > 0) {
    const report = await generateErrorReport({
      headers,
      failedRows,
    });

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const folder = `organization-${currentUser.organizationId}/${year}/${month}`;

    console.log({
      envBucket: process.env.SUPABASE_IMPORT_REPORT_BUCKET,
      folder,
      fileName: report.fileName,
    });

    const updloadedReport = await uploadFile({
      bucket: process.env.SUPABASE_IMPORT_REPORT_BUCKET,

      folder,

      fileName: report.fileName,

      buffer: report.buffer,

      contentType: report.contentType,

      expiresIn: 3600,
    });

    errorReport = {
      fileName: updloadedReport.fileName,

      downloadUrl: updloadedReport.downloadUrl,

      expiresIn: 3600,
    };
  }

  /*
  ==========================================
      Response
  ==========================================
  */

  const response = buildImportResponse({
    totalRows: rows.length,

    processed: batch.statistics.processed,

    inserted: batch.statistics.inserted,

    failed: batch.statistics.failed,

    skipped: batch.statistics.skipped,

    errorReport,
  });

  console.log("Import Response:", response);

  return response;
}
