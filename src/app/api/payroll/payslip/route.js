// /api/payroll/payslip/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const payroll = await prisma.payroll.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!payroll) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // ✅ SAFE SERIALIZATION
  const safePayroll = JSON.parse(
    JSON.stringify(payroll, (key, value) => (typeof value === "bigint" ? Number(value) : value))
  );

  return NextResponse.json({
    success: true,
    data: safePayroll,
  });
}
