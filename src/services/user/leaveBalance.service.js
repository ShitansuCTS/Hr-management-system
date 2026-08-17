export async function allocateDefaultLeaveBalances(tx, userId) {
  const currentYear = new Date().getFullYear();

  await tx.leaveBalance.createMany({
    data: [
      {
        userId,
        leaveType: "PAID_LEAVE",
        allocated: 6,
        used: 0,
        remaining: 6,
        year: currentYear,
      },

      {
        userId,
        leaveType: "SICK_LEAVE",
        allocated: 6,
        used: 0,
        remaining: 6,
        year: currentYear,
      },

      {
        userId,
        leaveType: "CASUAL_LEAVE",
        allocated: 8,
        used: 0,
        remaining: 8,
        year: currentYear,
      },
    ],
  });
}
