import { prisma } from "@/lib/prisma";

const CHUNK_SIZE = 100;

export async function processChunks(batch, organizationId) {
  const employees = batch.data.employees;

  for (let start = 0; start < employees.length; start += CHUNK_SIZE) {
    const employeeChunk = employees.slice(start, start + CHUNK_SIZE);

    const users = [];

    const financials = [];

    const leaveBalances = [];

    for (const employee of employeeChunk) {
      if (employee.user.organizationId !== organizationId) {
        const error = new Error("Employee organization mismatch.");

        error.statusCode = 500;

        throw error;
      }
      users.push(employee.user);

      financials.push(employee.financial);

      leaveBalances.push(...employee.leaveBalances);
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.createMany({
        data: users,
      });

      await tx.financialDetails.createMany({
        data: financials,
      });

      await tx.leaveBalance.createMany({
        data: leaveBalances,
      });
    });

    batch.statistics.inserted += users.length;
  }
}
