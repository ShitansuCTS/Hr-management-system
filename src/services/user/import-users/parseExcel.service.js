import ExcelJS from "exceljs";
import { EMPLOYEE_IMPORT_COLUMNS } from "@/config/employeeImport.config";

export async function parseExcel(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      const error = new Error("Excel sheet not found.");
      error.statusCode = 400;
      throw error;
    }

    const headerRow = worksheet.getRow(1);

    const headers = [];

    const headerMap = Object.fromEntries(
      Object.entries(EMPLOYEE_IMPORT_COLUMNS).map(([field, config]) => [config.header, field])
    );

    headerRow.eachCell((cell) => {
      headers.push(String(cell.value ?? "").trim());
    });

    const rows = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowObject = {};

      let isEmpty = true;

      headers.forEach((header, index) => {
        const field = headerMap[header];

        if (!field) {
          return;
        }

        const cell = row.getCell(index + 1);

        let value = cell.value;

        if (value instanceof Date) {
          // Keep Date object
        } else if (value && typeof value === "object") {
          if ("text" in value) {
            value = value.text;
          } else if ("result" in value) {
            value = value.result;
          } else if ("richText" in value) {
            value = value.richText.map((item) => item.text).join("");
          }
        }

        if (typeof value === "string") {
          value = value.trim();
        }

        if (value !== null && value !== undefined && value !== "") {
          isEmpty = false;
        }

        rowObject[field] = value;
      });

      if (!isEmpty) {
        rows.push({
          excelRow: rowNumber,
          ...rowObject,
        });
      }
    });

    return {
      headers,
      headerMap,
      rows,
    };
  } catch (error) {
    console.error("Excel Parser:", error);

    throw error;
  }
}
