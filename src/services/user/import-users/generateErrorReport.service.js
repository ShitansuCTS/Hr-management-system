import ExcelJS from "exceljs";
import { uploadFile } from "@/services/storage/uploadFile.service";

export async function generateErrorReport({ headers, failedRows, organizationId }) {
  try {
    /*
    ==========================================
        Create Workbook
    ==========================================
    */

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Import Errors");

    /*
    ==========================================
        Header Row
    ==========================================
    */

    worksheet.addRow([...headers, "Errors"]);

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    /*
    ==========================================
        Freeze Header
    ==========================================
    */

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    /*
    ==========================================
        Auto Filter
    ==========================================
    */

    worksheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: headers.length + 1,
      },
    };

    /*
    ==========================================
        Failed Rows
    ==========================================
    */

    for (const failedRow of failedRows) {
      const values = headers.map((header) => {
        return failedRow.originalRow[header] ?? "";
      });

      const errorMessage = failedRow.errors
        .map((error) => (error.field ? `${error.field}: ${error.message}` : error.message))
        .join(" | ");
      worksheet.addRow([...values, errorMessage]);
    }

    /*
    ==========================================
        Auto Width
    ==========================================
    */

    worksheet.columns.forEach((column) => {
      let maxLength = 15;

      column.eachCell?.(
        {
          includeEmpty: true,
        },
        (cell) => {
          const value = cell.value ? String(cell.value) : "";

          maxLength = Math.max(maxLength, value.length + 2);
        }
      );

      column.width = Math.min(maxLength, 40);
    });

    /*
    ==========================================
        Wrap Error Column
    ==========================================
    */

    const errorColumn = worksheet.getColumn(headers.length + 1);

    errorColumn.alignment = {
      wrapText: true,
      vertical: "top",
    };

    /*
    ==========================================
        Workbook Buffer
    ==========================================
    */

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

    /*
    ==========================================
        Upload
    ==========================================
    */

    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const folder = `organization-${organizationId}/${year}/${month}`;

    const fileName = `employee-import-errors-${Date.now()}.xlsx`;

    return {
      buffer,
      fileName,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  } catch (error) {
    console.error("Generate Error Report:", error);

    throw new Error("Failed to generate employee import error report.");
  }
}
