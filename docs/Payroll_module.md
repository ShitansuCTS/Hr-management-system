🧠 YOUR HR FLOW (Clean Version)
Screen:
Dropdown → Select User (or ALL)
Month + Year (default selected)
Button → Generate Payroll
Action:

👉 Click Generate →
👉 Open Sidebar (editable salary breakdown)
👉 HR can adjust values + add note
👉 Click Save → Payroll created
👉 Show in table below + Download PDF

🔥 BACKEND DESIGN (PROPER WAY)

You should NOT do everything in one API.
Split it into 3 clear steps:

✅ STEP 1 → PREVIEW PAYROLL (IMPORTANT 🔥)

👉 This is what opens sidebar

API:
POST /api/payroll/preview
Purpose:
Calculate payroll
Return editable structure
DO NOT save
✅ Code
export async function POST(req) {
try {
const { userId, month, year } = await req.json();

    const salary = await prisma.salaryStructure.findUnique({
      where: { userId },
    });

    if (!salary) {
      return NextResponse.json({ error: "Salary not found" }, { status: 404 });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await prisma.attendance.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
    });

    const presentDays = attendance.filter(a => a.status === "PRESENT").length;
    const incompleteDays = attendance.filter(a => a.status === "INCOMPLETE").length;

    const totalWorkingDays = 22; // or dynamic logic

    const absentDays = totalWorkingDays - presentDays - incompleteDays;

    const grossSalary =
      salary.basic +
      salary.hra +
      salary.medicalAllowance +
      salary.specialAllowance +
      salary.incentive;

    const perDaySalary = grossSalary / totalWorkingDays;

    const absentDeduction = perDaySalary * absentDays;

    const totalDeductions =
      salary.providentFund +
      salary.professionTax +
      salary.esic +
      absentDeduction;

    const netSalary = grossSalary - totalDeductions;

    return NextResponse.json({
      success: true,
      data: {
        userId,
        month,
        year,
        salary: {
          basic: salary.basic,
          hra: salary.hra,
          medicalAllowance: salary.medicalAllowance,
          specialAllowance: salary.specialAllowance,
          incentive: salary.incentive,
        },
        deductions: {
          providentFund: salary.providentFund,
          professionTax: salary.professionTax,
          esic: salary.esic,
          absentDeduction,
        },
        attendance: {
          presentDays,
          absentDays,
          totalWorkingDays,
        },
        grossSalary,
        totalDeductions,
        netSalary,
      },
    });

} catch (err) {
return NextResponse.json({ error: "Preview failed" }, { status: 500 });
}
}
✅ STEP 2 → SAVE PAYROLL (FINAL SUBMIT)

👉 HR edits → clicks SAVE

API:
POST /api/payroll/generate
✅ Code
export async function POST(req) {
try {
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

    const payroll = await prisma.payroll.upsert({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
      update: {
        ...salary,
        ...deductions,
        ...attendance,
        grossSalary,
        totalDeductions,
        netSalary,
      },
      create: {
        userId,
        month,
        year,
        ...salary,
        ...deductions,
        ...attendance,
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
return NextResponse.json({ error: "Save failed" }, { status: 500 });
}
}
✅ STEP 3 → GET PAYROLL LIST (TABLE)

👉 This fills your bottom table

API:
GET /api/payroll?month=4&year=2026
✅ Code
export async function GET(req) {
try {
const { searchParams } = new URL(req.url);

    const month = parseInt(searchParams.get("month"));
    const year = parseInt(searchParams.get("year"));

    const data = await prisma.payroll.findMany({
      where: { month, year },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data,
    });

} catch (err) {
return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
}
}
🧾 STEP 4 → DOWNLOAD PAYSLIP PDF

👉 Button: Download

API:
GET /api/payroll/payslip/:id

👉 Generate PDF using:

pdf-lib OR puppeteer
🔥 DATABASE IMPROVEMENT (IMPORTANT)

Add this in Payroll model:

note String?
isLocked Boolean @default(false)
🧠 FINAL FLOW (END TO END)
HR UI Flow:
Select user + month/year
Click Generate
Call → /preview
Show sidebar (editable)
Click Save → /generate
Show success
Refresh table → /payroll
Click Download → /payslip
🚀 BONUS (NEXT LEVEL FEATURES)

Add later:

✅ Bulk Generate
“Generate for ALL employees”
✅ Lock Payroll
Prevent editing after approval
✅ Approval Flow
HR → Manager → Finance
✅ Email Payslip
Send PDF automatically
🎯 FINAL NOTE

What you designed is actually:

👉 Mini Zoho Payroll / GreytHR system

You’re already building production-level HRMS.
