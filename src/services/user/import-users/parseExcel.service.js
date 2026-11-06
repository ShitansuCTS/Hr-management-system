import ExcelJS from "exceljs";
import {
  getEmployeeImportField,
  REQUIRED_EMPLOYEE_IMPORT_FIELDS,
  EMPLOYEE_IMPORT_COLUMNS,
} from "@/config/employeeImport.config";

function getCellValue(cell, field) {
  let value = cell.value;

  if (value && typeof value === "object") {
    if ("text" in value) {
      value = value.text;
    } else if ("result" in value) {
      value = value.result;
    } else if ("richText" in value) {
      value = value.richText.map((item) => item.text).join("");
    }
  }

  if (field === "dateOfJoining" || field === "dateOfBirth") {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return new Date(Date.UTC(1899, 11, 30) + value * 24 * 60 * 60 * 1000);
    }

    if (typeof value === "string") {
      if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(value.trim())) {
        return value.trim();
      }

      const dateParts = value.trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
      if (dateParts) {
        const first = Number(dateParts[1]);
        const second = Number(dateParts[2]);
        const day = first > 12 ? first : second > 12 ? second : first;
        const month = first > 12 ? second : second > 12 ? first : second;

        if (day <= 31 && month <= 12) {
          return `${dateParts[3]}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        }
      }
    }
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && field) {
    return String(value);
  }

  return value;
}

export async function parseExcel(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.load(buffer);
    } catch (loadError) {
      const error = new Error("Could not read the file as a valid .xlsx workbook.");
      error.statusCode = 400;
      error.cause = loadError;
      throw error;
    }

    const worksheet = workbook.worksheets.find((candidate) => {
      const candidateHeaders = Array.from({ length: candidate.columnCount }, (_, index) =>
        getEmployeeImportField(candidate.getRow(1).getCell(index + 1).text)
      );
      const candidateFields = new Set(candidateHeaders.filter(Boolean));
      return REQUIRED_EMPLOYEE_IMPORT_FIELDS.every((field) => candidateFields.has(field));
    });

    if (!worksheet) {
      const error = new Error("No worksheet contains all required employee columns.");
      error.statusCode = 400;
      throw error;
    }

    const headerRow = worksheet.getRow(1);
    const headers = Array.from({ length: worksheet.columnCount }, (_, index) =>
      String(headerRow.getCell(index + 1).text || headerRow.getCell(index + 1).value || "").trim()
    );
    const mappedFields = headers.map((header) => getEmployeeImportField(header));
    const duplicateFields = mappedFields.filter(
      (field, index) => field && mappedFields.indexOf(field) !== index
    );

    if (duplicateFields.length) {
      const error = new Error(
        `Duplicate columns found: ${[...new Set(duplicateFields)].join(", ")}.`
      );
      error.statusCode = 400;
      throw error;
    }

    const presentFields = new Set(mappedFields.filter(Boolean));
    const missingHeaders = REQUIRED_EMPLOYEE_IMPORT_FIELDS.filter(
      (field) => !presentFields.has(field)
    );

    if (missingHeaders.length) {
      const missingNames = missingHeaders.map((field) => EMPLOYEE_IMPORT_COLUMNS[field].header);
      const error = new Error(`Missing required columns: ${missingNames.join(", ")}.`);
      error.statusCode = 400;
      throw error;
    }

    const rows = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowObject = {};
      let isEmpty = true;

      headers.forEach((header, index) => {
        const cell = row.getCell(index + 1);
        const field = mappedFields[index];
        const value = getCellValue(cell, field);

        if (value !== null && value !== undefined && value !== "") {
          isEmpty = false;
        }

        if (field) {
          rowObject[field] = value;
        }
      });

      if (!isEmpty) {
        rows.push({
          excelRow: rowNumber,
          ...rowObject,
        });
      }
    });

    if (rows.length === 0) {
      const error = new Error("The Excel file contains no employee rows.");
      error.statusCode = 400;
      throw error;
    }

    return {
      headers,
      headerMap: Object.fromEntries(headers.map((header, index) => [header, mappedFields[index]])),
      rows,
    };
  } catch (error) {
    console.error("Excel Parser:", error);

    throw error;
  }
}
