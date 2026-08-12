import { validateCreateDesignation } from "@/validations/designation.validation";
import {
  createDesignationService,
  getDesignationService,
  deleteDesignationService,
} from "@/services/designation/designation.service";

export async function createDesignationController(currentUser, body) {
  const designationData = validateCreateDesignation(body);

  const designation = await createDesignationService(currentUser, designationData);

  return {
    success: true,
    message: "Designation created successfully",
    data: designation,
  };
}

export async function getDesignationController(currentUser) {
  const designations = await getDesignationService(currentUser);

  return {
    success: true,
    message: "designations fetched successfully",
    data: designations,
  };
}


export async function deleteDesignationController(currentUser, id) {
  if (!id) {
    const error = new Error("Designation id is required");

    error.statusCode = 400;

    throw error;
  }

  const deletedDesignation = await deleteDesignationService(currentUser, id);

  return {
    success: true,
    message: "Designation deleted successfully",
    data: deletedDesignation,
  };
}
