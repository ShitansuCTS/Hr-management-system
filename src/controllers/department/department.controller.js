import { validateCreateDepartment } from "@/validations/department.validation";
import {
  createDepartmentService,
  getDepartmentService,
  deleteDepartmentService,
} from "@/services/department/department.service";

export async function createDepartmentController(body) {
  
  const { name } = body;

  const departmentData = validateCreateDepartment({
    departmentName: name,
  });

  const department = await createDepartmentService(departmentData);

  return {
    success: true,
    message: "Department Created Successfully",
    data: department,
  };
}

export async function getDepartmentController() {
  const departments = await getDepartmentService();

  return {
    success: true,
    message: "departments fetched successfully",
    data: departments,
  };
}

export async function deleteDepartmentController(id) {
  if (!id) {
    const error = new Error("Department id is required");

    error.statusCode = 400;

    throw error;
  }

  const deletedDepartment = await deleteDepartmentService(id);

  return {
    success: true,
    message: "Department deleted successfully",
    data: deletedDepartment,
  };
}
