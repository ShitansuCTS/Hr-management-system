import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      userId,
      month,
      year,
      salary,
      deductions,
      attendance,
      grossSalary,
      totalDeductions,
      netSalary,
      note,
    } = body;

    if (!userId || !month || !year) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

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

        providentFund: deductions.providentFund,
        professionTax: deductions.professionTax,
        esic: deductions.esic,

        totalWorkingDays: attendance.totalWorkingDays,
        presentDays: attendance.presentDays,
        absentDays: attendance.absentDays,

        grossSalary,
        totalDeductions,
        netSalary,
      },
      create: {
        userId,
        month,
        year,

        basic: salary.basic,
        hra: salary.hra,
        medicalAllowance: salary.medicalAllowance,
        specialAllowance: salary.specialAllowance,
        incentive: salary.incentive,

        providentFund: deductions.providentFund,
        professionTax: deductions.professionTax,
        esic: deductions.esic,

        totalWorkingDays: attendance.totalWorkingDays,
        presentDays: attendance.presentDays,
        absentDays: attendance.absentDays,

        grossSalary,
        totalDeductions,
        netSalary,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payroll generated successfully",
      data: payroll,
    });
  } catch (err) {
    console.error("PAYROLL GENERATE ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}
