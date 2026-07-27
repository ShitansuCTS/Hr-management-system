import ExcelJS from "exceljs";

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

    headerRow.eachCell((cell) => {
      headers.push(String(cell.value ?? "").trim());
    });

    const rows = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowObject = {};

      let isEmpty = true;

      headers.forEach((header, index) => {
        const cell = row.getCell(index + 1);

        let value = cell.value;

        if (value && typeof value === "object") {
          if ("text" in value) {
            value = value.text;
          } else if ("result" in value) {
            value = value.result;
          }
        }

        if (typeof value === "string") {
          value = value.trim();
        }

        if (value !== null && value !== undefined && value !== "") {
          isEmpty = false;
        }

        rowObject[header] = value;
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
      rows,
    };
  } catch (error) {
    console.error("Excel Parser:", error);

    throw error;
  }
}
