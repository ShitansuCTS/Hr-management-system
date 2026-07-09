import { getLeaveBalanceService } from "@/services/leave/myleaveBalance.service";

export async function getLeaveBalanceController(currentUser) {
  const leaveBalances = await getLeaveBalanceService(currentUser);

  return {
    success: true,
    message: "Leave balances fetched successfully",
    data: leaveBalances,
  };
}
