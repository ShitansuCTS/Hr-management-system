import { validateCreateLeave } from "@/validations/leave.validation";
import {
  createLeaveService,
  getLeaveApplicationsService,
  getAllLeaveApplicationsService,
} from "@/services/leave/leave.service";

export async function createLeaveController(body, currentUser) {
  const leaveData = validateCreateLeave(body);

  const leaveApplication = await createLeaveService(leaveData, currentUser);

  return {
    success: true,
    message: "Leave applied successfully",
    data: leaveApplication,
  };
}

export async function getLeaveApplicationsController(currentUser) {
  const leaveApplications = await getLeaveApplicationsService(currentUser);

  return {
    success: true,
    message: "Leave applications fetched successfully",
    data: leaveApplications,
  };
}

export async function getAllLeaveApplicationsController(currentUser) {
  const allLeaveApplications = await getAllLeaveApplicationsService(currentUser);

  return {
    success: true,
    message: "Leave applications fetched successfully",
    data: allLeaveApplications,
  };
}
