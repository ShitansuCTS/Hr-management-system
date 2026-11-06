import { validateImportedUser } from "@/validations/user.validation";
import { EMPLOYEE_IMPORT_COLUMNS } from "@/config/employeeImport.config";
import { buildDesignationKey } from "@/utils/import-users/buildDesignationKey";
import { ZodError } from "zod";

export async function validateEmployeeRow(
  row,
  excelRow,
  lookupMaps,
  importedEmailSet,
  importedEmployeeIdSet
) {
  const { emailSet, employeeIdSet, departmentMap, designationMap } = lookupMaps;

  /*
  ==========================================
      Convert Excel → Internal Object
  ==========================================
  */

  const employee = {};

  for (const field in EMPLOYEE_IMPORT_COLUMNS) {
    employee[field] = row[field] ?? "";
  }

  for (const field of [
    "employeeId",
    "phone",
    "accountNo",
    "uanNo",
    "esicNo",
    "pincode",
    "emergencyContactPhone",
  ]) {
    employee[field] = employee[field] === "" ? "" : String(employee[field]);
  }

  if (employee.employmentType) {
    employee.employmentType = String(employee.employmentType)
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, "_");
  } else {
    employee.employmentType = undefined;
  }

  employee.gender = employee.gender ? String(employee.gender).trim().toUpperCase() : undefined;
  employee.bloodGroup = employee.bloodGroup
    ? String(employee.bloodGroup).trim().toUpperCase().replace(/\s+/g, "")
    : undefined;

  if (employee.employmentType === "FULLTIME") employee.employmentType = "FULL_TIME";
  if (employee.employmentType === "PARTTIME") employee.employmentType = "PART_TIME";

  for (const field of ["dateOfJoining", "dateOfBirth"]) {
    if (employee[field] instanceof Date) {
      employee[field] = employee[field].toISOString().split("T")[0];
    }
  }

  /*
  ==========================================
      Reuse Existing Zod Validation
  ==========================================
  */

  let validatedEmployee;

  try {
    validatedEmployee = validateImportedUser(employee);
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.issues.map((issue) => ({
          row: excelRow,
          field: issue.path.join("."),
          message: issue.message,
        })),
      };
    }

    throw error;
  }

  if (!validatedEmployee.dateOfJoining) {
    return {
      success: false,
      errors: [
        {
          row: excelRow,
          field: "dateOfJoining",
          message: "Date of joining is required.",
        },
      ],
    };
  }

  /*
  ==========================================
      Duplicate Email (Database)
  ==========================================
  */

  const email = validatedEmployee.email?.trim().toLowerCase();

  if (emailSet.has(email)) {
    return {
      success: false,
      errors: [
        {
          row: excelRow,
          field: "email",
          message: "Email already exists.",
        },
      ],
    };
  }

  /*
  ==========================================
      Duplicate Email (Excel)
  ==========================================
  */

  if (importedEmailSet.has(email)) {
    return {
      success: false,
      errors: [
        {
          row: excelRow,
          field: "email",
          message: "Duplicate email found in uploaded Excel.",
        },
      ],
    };
  }

  /*
  ==========================================
      Duplicate Employee ID (Database)
  ==========================================
  */

  if (
    employeeIdSet.has(`CTSL${validatedEmployee.employeeId}`) ||
    employeeIdSet.has(validatedEmployee.employeeId)
  ) {
    return {
      success: false,
      errors: [
        {
          row: excelRow,
          field: "employeeId",
          message: "Employee ID already exists.",
        },
      ],
    };
  }

  /*
  ==========================================
      Duplicate Employee ID (Excel)
  ==========================================
  */

  if (importedEmployeeIdSet.has(validatedEmployee.employeeId)) {
    return {
      success: false,
      errors: [
        {
          row: excelRow,
          field: "employeeId",
          message: "Duplicate Employee ID found in uploaded Excel.",
        },
      ],
    };
  }

  /*
  ==========================================
      Department Validation
  ==========================================
  */

  const departmentName = validatedEmployee.department?.trim().toLowerCase();
  const department = departmentName ? departmentMap.get(departmentName) : null;

  if (departmentName && !department) {
    return {
      success: false,
      errors: [
        {
          row: excelRow,
          field: "department",
          value: validatedEmployee.department,

          message: "Department does not exist.",
        },
      ],
    };
  }

  /*
  ==========================================
      Designation Validation
  ==========================================
  */

  const designationName = validatedEmployee.designation?.trim();
  const designationKey =
    department && designationName ? buildDesignationKey(department.id, designationName) : null;
  const designation = designationKey ? designationMap.get(designationKey) : null;

  if (designationName && !department) {
    return {
      success: false,
      errors: [
        {
          row: excelRow,
          field: "department",
          value: validatedEmployee.department,
          message: "A department is required when a designation is provided.",
        },
      ],
    };
  }

  if (designationName && !designation) {
    return {
      success: false,
      errors: [
        {
          row: excelRow,
          field: "designation",
          value: validatedEmployee.designation,

          message: "Designation does not belong to selected department.",
        },
      ],
    };
  }

  /*
  ==========================================
      Replace Name with IDs
  ==========================================
  */

  validatedEmployee.departmentId = department?.id ?? null;

  validatedEmployee.designationId = designation?.id ?? null;

  delete validatedEmployee.department;
  delete validatedEmployee.designation;

  importedEmailSet.add(email);
  importedEmployeeIdSet.add(validatedEmployee.employeeId);

  return {
    success: true,
    employee: validatedEmployee,
  };
}
