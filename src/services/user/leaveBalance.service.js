export async function allocateDefaultLeaveBalances(tx, userId, organizationId) {
  const currentYear = new Date().getFullYear();

  await tx.leaveBalance.createMany({
    data: [
      {
        userId,
        organizationId,
        leaveType: "PAID_LEAVE",
        allocated: 6,
        used: 0,
        remaining: 6,
        year: currentYear,
      },

      {
        userId,
        organizationId,
        leaveType: "SICK_LEAVE",
        allocated: 6,
        used: 0,
        remaining: 6,
        year: currentYear,
      },

      {
        userId,
        organizationId,
        leaveType: "CASUAL_LEAVE",
        allocated: 8,
        used: 0,
        remaining: 8,
        year: currentYear,
      },
    ],
  });
}
