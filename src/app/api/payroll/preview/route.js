import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    // 🔐 AUTH
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 📥 INPUT
    const body = await req.json();
    const { userId, month, year, attendance } = body;

    if (!userId || !month || !year) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // 👤 USER
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: decoded.organizationId,
      },
      select: {
        id: true,
        fullName: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 💰 SALARY
    const salary = await prisma.salaryStructure.findFirst({
      where: {
        userId,
      },
    });

    if (!salary) {
      return NextResponse.json({ message: "Salary structure not found" }, { status: 404 });
    }

    // 🧠 DEFAULT ATTENDANCE (CAN BE OVERRIDDEN)
    const totalWorkingDays = 26;

    const presentDays = attendance?.presentDays ?? 26;

    const absentDays = attendance?.absentDays ?? 0;

    // 🛡️ SAFETY (NO NEGATIVE VALUES)
    const safePresent = Math.max(0, presentDays);
    const safeAbsent = Math.max(0, absentDays);

    // 💵 GROSS SALARY
    const grossSalary =
      (salary.basic || 0) +
      (salary.hra || 0) +
      (salary.medicalAllowance || 0) +
      (salary.specialAllowance || 0) +
      (salary.incentive || 0);

    // ✅ DEDUCTION BASE (IMPORTANT LOGIC)
    const deductionBase = (salary.basic || 0) + (salary.hra || 0);

    const perDaySalary = deductionBase / totalWorkingDays;

    const absentDeduction = perDaySalary * safeAbsent;

    // 📉 TOTAL DEDUCTIONS
    const totalDeductions =
      (salary.providentFund || 0) +
      (salary.professionTax || 0) +
      (salary.esic || 0) +
      absentDeduction;

    // ❌ FIXED (NO DOUBLE PF)
    const netSalary = grossSalary - totalDeductions - salary.providentFund;

    // 📤 RESPONSE
    return NextResponse.json({
      success: true,
      data: {
        user,
        month,
        year,

        salary: {
          basic: salary.basic || 0,
          hra: salary.hra || 0,
          medicalAllowance: salary.medicalAllowance || 0,
          specialAllowance: salary.specialAllowance || 0,
          incentive: salary.incentive || 0,
        },

        deductions: {
          providentFund: salary.providentFund || 0,
          professionTax: salary.professionTax || 0,
          esic: salary.esic || 0,
          absentDeduction,
        },

        attendance: {
          presentDays: safePresent,
          absentDays: safeAbsent,
          totalWorkingDays,
        },

        summary: {
          grossSalary,
          totalDeductions,
          netSalary,
        },

        note: "",
      },
    });
  } catch (err) {
    console.error("PAYROLL PREVIEW ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}
