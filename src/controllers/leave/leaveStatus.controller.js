import { validateLeaveStatus } from "@/validations/leaveStatus.validation";
import { updateLeaveStatusService } from "@/services/leave/leaveStatus.service";

export async function updateLeaveStatusController(body, leaveId, currentUser) {
  const leaveStatus = validateLeaveStatus(body);

  const leave = await updateLeaveStatusService(leaveStatus, leaveId, currentUser);

  return {
    success: true,

    message: "Leave status updated successfully",

    data: leave,
  };
}
