import { getEmployeeActivityService } from "@/services/user/users-profile/employeeActivity.service";

export async function getEmployeeActivityController(employeeId, currentUser) {
  const activities = await getEmployeeActivityService(employeeId, currentUser);

  return {
    success: true,
    data: { activities },
  };
}
