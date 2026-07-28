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
    const column = EMPLOYEE_IMPORT_COLUMNS[field];

    employee[field] = row[field];
  }

  employee.employeeId = String(employee.employeeId);
  employee.phone = String(employee.phone);

  employee.accountNo = employee.accountNo ? String(employee.accountNo) : "";

  employee.uanNo = employee.uanNo ? String(employee.uanNo) : "";

  employee.esicNo = employee.esicNo ? String(employee.esicNo) : "";

  employee.pincode = employee.pincode ? String(employee.pincode) : "";

  employee.emergencyContactPhone = employee.emergencyContactPhone
    ? String(employee.emergencyContactPhone)
    : "";

  employee.dateOfJoining = employee.dateOfJoining
    ? employee.dateOfJoining.toISOString().split("T")[0]
    : "";

  employee.dateOfBirth = employee.dateOfBirth
    ? employee.dateOfBirth.toISOString().split("T")[0]
    : "";

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

  importedEmailSet.add(email);

  /*
  ==========================================
      Duplicate Employee ID (Database)
  ==========================================
  */

  if (employeeIdSet.has(validatedEmployee.employeeId)) {
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

  importedEmployeeIdSet.add(validatedEmployee.employeeId);

  /*
  ==========================================
      Department Validation
  ==========================================
  */

  const department = departmentMap.get(validatedEmployee.department.trim().toLowerCase());

  if (!department) {
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

  const designationKey = buildDesignationKey(department.id, validatedEmployee.designation);

  const designation = designationMap.get(designationKey);

  if (!designation) {
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

  validatedEmployee.departmentId = department.id;

  validatedEmployee.designationId = designation.id;

  delete validatedEmployee.department;
  delete validatedEmployee.designation;

  return {
    success: true,
    employee: validatedEmployee,
  };
}
