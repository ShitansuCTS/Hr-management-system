import ExcelJS from "exceljs";
import { EMPLOYEE_IMPORT_COLUMNS } from "@/config/employeeImport.config";

export async function generateErrorReport({ headers, failedRows }) {
  try {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Import Errors");

    worksheet.addRow([...headers, "Errors"]);

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

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

    const headerMap = Object.fromEntries(
      Object.entries(EMPLOYEE_IMPORT_COLUMNS).map(([field, config]) => [config.header, field])
    );

    for (const failedRow of failedRows) {
      const values = headers.map((header) => {
        const field = headerMap[header];

        let value = failedRow.originalRow[field] ?? "";

        if (value instanceof Date) {
          const day = String(value.getDate()).padStart(2, "0");
          const month = String(value.getMonth() + 1).padStart(2, "0");
          const year = value.getFullYear();

          value = `${day}-${month}-${year}`;
        }

        return value;
      });

      const errorMessage = failedRow.errors
        .map((error) => (error.field ? `${error.field}: ${error.message}` : error.message))
        .join("\n");
      worksheet.addRow([...values, errorMessage]);
    }

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

    const errorColumn = worksheet.getColumn(headers.length + 1);

    errorColumn.alignment = {
      wrapText: true,
      vertical: "top",
    };

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

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
