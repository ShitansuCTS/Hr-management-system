import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/services/user/welcomeEmail.service";

const CHUNK_SIZE = 100;
const ROW_DATA_ERROR_CODES = ["P2000", "P2002", "P2003", "P2006", "P2007", "P2011", "P2012"];

function getPersistenceError(error) {
  if (error?.code === "P2002") {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(",")
      : String(error.meta?.target ?? "");

    if (target.toLowerCase().includes("email")) {
      return { field: "email", message: "Email already exists." };
    }

    if (target.toLowerCase().includes("employeeid")) {
      return { field: "employeeId", message: "Employee ID already exists." };
    }

    return { field: "SYSTEM", message: "A duplicate record already exists." };
  }

  if (error?.code === "P2003") {
    return {
      field: "department",
      message: "The department or designation assignment is no longer available.",
    };
  }

  return {
    field: "SYSTEM",
    message: "The employee could not be saved. Check the row data and try again.",
  };
}

function isDatabaseUnavailable(error) {
  return (
    error instanceof Prisma.PrismaClientInitializationError ||
    ["P1000", "P1001", "P1017", "P2024"].includes(error?.code)
  );
}

async function sendWelcomeEmails(employees) {
  for (let index = 0; index < employees.length; index += 10) {
    const emailBatch = employees.slice(index, index + 10);
    await Promise.all(emailBatch.map(({ user }) => sendWelcomeEmail(user)));
  }
}

async function persistEmployee(employee) {
  await prisma.$transaction(async (tx) => {
    await tx.user.create({ data: employee.user });
    await tx.financialDetails.create({ data: employee.financial });
    await tx.payrollSettings.create({ data: employee.payrollSettings });
    await tx.leaveBalance.createMany({ data: employee.leaveBalances });
  });
}

export async function processChunks(batch, organizationId) {
  const employees = batch.data.employees;
  const failedRows = [];

  for (let start = 0; start < employees.length; start += CHUNK_SIZE) {
    const employeeChunk = employees.slice(start, start + CHUNK_SIZE);

    for (const employee of employeeChunk) {
      if (employee.user.organizationId !== organizationId) {
        const error = new Error("Employee organization mismatch.");
        error.statusCode = 500;
        throw error;
      }
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.user.createMany({
          data: employeeChunk.map(({ user }) => user),
        });

        await tx.financialDetails.createMany({
          data: employeeChunk.map(({ financial }) => financial),
        });

        await tx.payrollSettings.createMany({
          data: employeeChunk.map(({ payrollSettings }) => payrollSettings),
        });

        await tx.leaveBalance.createMany({
          data: employeeChunk.flatMap(({ leaveBalances }) => leaveBalances),
        });
      });

      batch.statistics.inserted += employeeChunk.length;
      await sendWelcomeEmails(employeeChunk);
      continue;
    } catch (chunkError) {
      if (isDatabaseUnavailable(chunkError)) {
        throw chunkError;
      }

      if (!ROW_DATA_ERROR_CODES.includes(chunkError?.code)) {
        throw chunkError;
      }

      console.error("Bulk employee insert failed; retrying records individually:", chunkError);
    }

    for (const employee of employeeChunk) {
      try {
        await persistEmployee(employee);
        batch.statistics.inserted++;
        await sendWelcomeEmails([employee]);
      } catch (error) {
        if (isDatabaseUnavailable(error)) {
          throw error;
        }

        if (!ROW_DATA_ERROR_CODES.includes(error?.code)) {
          throw error;
        }

        console.error("Employee import row could not be saved:", {
          excelRow: employee.excelRow,
          error,
        });

        batch.statistics.failed++;
        failedRows.push({
          excelRow: employee.excelRow,
          originalRow: employee.sourceRow,
          errors: [
            {
              row: employee.excelRow,
              ...getPersistenceError(error),
            },
          ],
        });
      }
    }
  }

  return failedRows;
}
