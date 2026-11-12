import { getEmployeeLeaveStatusService } from "@/services/leave/employeeLeaveStatus.service";

export async function getEmployeeLeaveStatusController(
    employeeId,
    currentUser
) {
    const result = await getEmployeeLeaveStatusService(
        employeeId,
        currentUser
    );

    return {
        success: true,
        data: result,
    };
}