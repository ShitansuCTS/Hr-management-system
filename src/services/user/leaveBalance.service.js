export async function allocateDefaultLeaveBalances(
  tx,
  userId
) {
  const currentYear =
    new Date().getFullYear();

  await tx.leaveBalance.createMany({
    data: [
      {
        userId,
        leaveType: "PAID_LEAVE",
        allocated: 20,
        used: 0,
        remaining: 20,
        year: currentYear,
      },

      {
        userId,
        leaveType: "SICK_LEAVE",
        allocated: 10,
        used: 0,
        remaining: 10,
        year: currentYear,
      },

      {
        userId,
        leaveType: "CASUAL_LEAVE",
        allocated: 10,
        used: 0,
        remaining: 10,
        year: currentYear,
      },

      {
        userId,
        leaveType: "BEREAVEMENT_LEAVE",
        allocated: 5,
        used: 0,
        remaining: 5,
        year: currentYear,
      },

      {
        userId,
        leaveType: "OPTIONAL_LEAVE",
        allocated: 2,
        used: 0,
        remaining: 2,
        year: currentYear,
      },

      {
        userId,
        leaveType: "PATERNITY_LEAVE",
        allocated: 2,
        used: 0,
        remaining: 2,
        year: currentYear,
      },

      {
        userId,
        leaveType: "MATERNITY_LEAVE",
        allocated: 2,
        used: 0,
        remaining: 2,
        year: currentYear,
      },
    ],
  });
}