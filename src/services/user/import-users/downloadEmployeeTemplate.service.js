import ExcelJS from "exceljs";
import { EMPLOYEE_IMPORT_COLUMNS } from "@/config/employeeImport.config";

export async function downloadEmployeeTemplateService() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employees");

  worksheet.columns = Object.entries(EMPLOYEE_IMPORT_COLUMNS).map(([field, config]) => ({
    header: config.required ? `${config.header} *` : config.header,
    key: field,
  }));

  worksheet.getRow(1).font = {
    bold: true,
    color: { argb: "FFFFFFFF" },
  };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2257A7" },
  };
  worksheet.getRow(1).height = 24;
  worksheet.getRow(1).alignment = { vertical: "middle", wrapText: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.autoFilter = {
    from: "A1",
    to: { row: 1, column: worksheet.columnCount },
  };

  for (const field of [
    "employeeId",
    "phone",
    "emergencyContactPhone",
    "accountNo",
    "uanNo",
    "esicNo",
    "pincode",
  ]) {
    worksheet.getColumn(field).numFmt = "@";
  }

  worksheet.getColumn("dateOfJoining").numFmt = "dd-mm-yyyy";
  worksheet.getColumn("dateOfBirth").numFmt = "dd-mm-yyyy";

  for (const [field, values] of Object.entries({
    employmentType: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"],
    gender: ["MALE", "FEMALE", "OTHER"],
    bloodGroup: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  })) {
    for (let rowNumber = 2; rowNumber <= 5000; rowNumber++) {
      worksheet.getCell(rowNumber, worksheet.getColumn(field).number).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${values.join(",")}"`],
      };
    }
  }

  worksheet.columns.forEach((column) => {
    column.width = Math.max(16, String(column.header).length + 3);
  });

  const instructions = workbook.addWorksheet("Read Me");
  instructions.columns = [
    { header: "Employee Import Guide", key: "title", width: 28 },
    { header: "Details", key: "details", width: 100 },
  ];
  instructions.addRows([
    {
      title: "Required columns",
      details:
        "Complete every column marked with *. Employee ID, Email, Full Name, Phone, Work Location, and Date Of Joining are required.",
    },
    {
      title: "Department and designation",
      details:
        "Optional. Use existing department and designation names. A designation must belong to the selected department.",
    },
    {
      title: "Accepted values",
      details:
        "Employment Type: FULL_TIME, PART_TIME, CONTRACT, INTERN. Gender: MALE, FEMALE, OTHER. Blood Group: A+, A-, B+, B-, AB+, AB-, O+, O-.",
    },
    {
      title: "Dates",
      details:
        "Enter dates as DD-MM-YYYY or use the date picker. The import worksheet accepts flexible column order and case-insensitive header names.",
    },
    {
      title: "Identifiers",
      details:
        "Keep Employee ID, phone numbers, and account identifiers as text to preserve leading zeroes.",
    },
    {
      title: "Import behavior",
      details:
        "Each imported employee receives the Employee role, default payroll settings, and the same default leave balances as an employee created in the app.",
    },
  ]);
  instructions.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  instructions.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2257A7" },
  };
  instructions.getColumn("details").alignment = { wrapText: true, vertical: "top" };
  instructions.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.height = 36;
    }
  });

  const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

  return {
    buffer,
    fileName: "employee-import-template.xlsx",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
}
