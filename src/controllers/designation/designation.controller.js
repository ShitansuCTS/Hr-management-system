import { validateCreateDesignation } from "@/validations/designation.validation";
import {
  createDesignationService,
  getDesignationService,
  deleteDesignationService,
} from "@/services/designation/designation.service";

export async function createDesignationController(body) {
  const designationData = validateCreateDesignation(body);

  const designation = await createDesignationService(designationData);

  return {
    success: true,
    message: "Designation created successfully",
    data: designation,
  };
}

export async function getDesignationController() {
  const designations = await getDesignationService();

  return {
    success: true,
    message: "designations fetched successfully",
    data: designations,
  };
}


export async function deleteDesignationController(id) {
  if (!id) {
    const error = new Error("Designation id is required");

    error.statusCode = 400;

    throw error;
  }

  const deletedDesignation = await deleteDesignationService(id);

  return {
    success: true,
    message: "Designation deleted successfully",
    data: deletedDesignation,
  };
}
