import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId, month, year } = await req.json();

    // 1. Get salary structure
    const salary = await prisma.salaryStructure.findUnique({
      where: { userId },
    });

    if (!salary) {
      return NextResponse.json({ error: "Salary not found" }, { status: 404 });
    }

    // 2. Get attendance
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const presentDays = attendance.filter((a) => a.status === "PRESENT").length;
    const absentDays = attendance.filter((a) => a.status === "ABSENT").length;

    const totalWorkingDays = presentDays + absentDays;

    // 3. Salary calculation
    const grossSalary =
      salary.basic +
      salary.hra +
      salary.medicalAllowance +
      salary.specialAllowance +
      salary.incentive;

    const perDaySalary = salary.basic / (totalWorkingDays || 1);
    const absentDeduction = perDaySalary * absentDays;

    const totalDeductions =
      salary.providentFund + salary.professionTax + salary.esic + absentDeduction;

    const netSalary = grossSalary - totalDeductions;

    // 4. Save payroll
    const payroll = await prisma.payroll.upsert({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
      update: {
        basic: salary.basic,
        hra: salary.hra,
        medicalAllowance: salary.medicalAllowance,
        specialAllowance: salary.specialAllowance,
        incentive: salary.incentive,

        providentFund: salary.providentFund,
        professionTax: salary.professionTax,
        esic: salary.esic,

        presentDays,
        absentDays,
        totalWorkingDays,
        grossSalary,
        totalDeductions,
        netSalary,
      },
      create: {
        userId,
        month,
        year,

        // ✅ manually map only needed fields
        basic: salary.basic,
        hra: salary.hra,
        medicalAllowance: salary.medicalAllowance,
        specialAllowance: salary.specialAllowance,
        incentive: salary.incentive,

        providentFund: salary.providentFund,
        professionTax: salary.professionTax,
        esic: salary.esic,

        presentDays,
        absentDays,
        totalWorkingDays,
        grossSalary,
        totalDeductions,
        netSalary,
      },
    });

    return NextResponse.json({ success: true, data: payroll });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error processing payroll" }, { status: 500 });
  }
}
