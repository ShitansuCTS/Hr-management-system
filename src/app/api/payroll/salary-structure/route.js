import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("The Data which are coming is ", body);

    const {
      userId,
      basic,
      hra,
      medicalAllowance,
      specialAllowance,
      incentive,
      providentFund,
      professionTax,
      esic,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const salary = await prisma.salaryStructure.upsert({
      where: { userId },
      update: {
        basic,
        hra,
        medicalAllowance,
        specialAllowance,
        incentive,
        providentFund,
        professionTax,
        esic,
      },
      create: {
        userId,
        basic,
        hra,
        medicalAllowance,
        specialAllowance,
        incentive,
        providentFund,
        professionTax,
        esic,
      },
    });

    return NextResponse.json({
      success: true,
      data: salary,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");


    // console.log("The user id is " , userId)

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const salary = await prisma.salaryStructure.findUnique({
      where: { userId },
    });

    // console.log("The salary sture is ", salary);

    return NextResponse.json({
      success: true,
      data: salary,
    });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
