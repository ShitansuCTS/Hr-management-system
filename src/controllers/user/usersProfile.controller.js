import { validateUpdateUserProfile } from "@/validations/usersProfile.validation";
import {
  getUserProfileService,
  updateUserProfileService,
} from "@/services/user/users-profile/usersProfile.service";

export async function getUserProfileController(employeeId, currentUser) {
  const employee = await getUserProfileService(employeeId, currentUser);

  return {
    success: true,
    message: "Employee fetched successfully.",
    data: employee,
  };
}

export async function updateUserProfileController(employeeId, body, currentUser) {
  const validatedData = validateUpdateUserProfile(body);
  const employee = await updateUserProfileService(employeeId, validatedData, currentUser);

  return {
    success: true,
    message: "Employee profile updated successfully.",
    data: employee,
  };
}
