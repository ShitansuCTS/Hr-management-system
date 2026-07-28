import ExcelJS from "exceljs";
import { EMPLOYEE_IMPORT_COLUMNS } from "@/config/employeeImport.config";

export async function downloadEmployeeTemplateService() {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Employees");

  worksheet.columns = Object.entries(EMPLOYEE_IMPORT_COLUMNS).map(([field, config]) => ({
    header: config.header,
    key: field,
  }));

  worksheet.getRow(1).font = {
    bold: true,
  };

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  worksheet.autoFilter = {
    from: "A1",
    to: {
      row: 1,
      column: worksheet.columnCount,
    },
  };

  worksheet.addRow({
    employeeId: "1001",
    email: "john.doe@example.com",
    fullName: "John Doe",
    phone: "9876543210",
    designation: "Software Engineer",
    department: "IT",
    employmentType: "FULL_TIME",
    workLocation: "Hyderabad",
    dateOfJoining: new Date(2026, 0, 15),
    gender: "MALE",
    dateOfBirth: new Date(2000, 0, 15),
    bloodGroup: "O+",
    fatherName: "Robert Doe",
    motherName: "Jane Doe",
    spouseName: "",
    bankName: "State Bank of India",
    accountNo: "123456789012",
    ifscCode: "SBIN0001234",
    panNumber: "ABCDE1234F",
    uanNo: "100123456789",
    esicNo: "1234567890",
    currentAddress: "123 Main Street",
    permanentAddress: "123 Main Street",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    pincode: "500001",
    emergencyContactName: "Jane Doe",
    emergencyContactPhone: "9876543211",
    emergencyContactRelation: "Mother",
    reportingManagerName: "Rahul Sharma",
  });

  ["dateOfJoining", "dateOfBirth"].forEach((key) => {
    const column = worksheet.getColumn(key);

    column.eachCell((cell, rowNumber) => {
      if (rowNumber > 1 && cell.value) {
        cell.numFmt = "dd-mm-yyyy";
      }
    });
  });

  worksheet.columns.forEach((column) => {
    let maxLength = 15;

    column.eachCell({ includeEmpty: true }, (cell) => {
      const value = cell.value ? cell.value.toString() : "";

      maxLength = Math.max(maxLength, value.length);
    });

    column.width = maxLength + 2;
  });

  const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

  return {
    buffer,
    fileName: "employee-import-template.xlsx",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
}
