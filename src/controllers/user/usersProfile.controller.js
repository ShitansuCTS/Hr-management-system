import { getUserProfileService } from "@/services/user/users-profile/usersProfile.service";

export async function getUserProfileController(employeeId, currentUser) {
  const employee = await getUserProfileService(
    employeeId,
    currentUser
  );

  return {
    success: true,
    message: "Employee fetched successfully.",
    data: employee,
  };
}