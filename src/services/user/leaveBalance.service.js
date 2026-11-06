import { DEFAULT_LEAVE_BALANCES } from "@/config/defaultLeaveBalances";

export async function allocateDefaultLeaveBalances(tx, userId, organizationId) {
  const currentYear = new Date().getFullYear();

  await tx.leaveBalance.createMany({
    data: DEFAULT_LEAVE_BALANCES.map(({ leaveType, allocated }) => ({
      userId,
      organizationId,
      leaveType,
      allocated,
      used: 0,
      remaining: allocated,
      year: currentYear,
    })),
  });
}
