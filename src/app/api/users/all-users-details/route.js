import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/jwt";
import { Resend } from "resend";
import cloudinary from "@/lib/cloudinary";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    // 🔐 Auth
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // ✅ ROLE CHECK (Very Important)
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Access denied. Admins only." }, { status: 403 });
    }

    const userId = decoded.userId;
    const organizationId = decoded.organizationId;

    // const data = await request.json();
    const formData = await request.formData(); // ✅ CORRECT
    // console.log("FORM DATA", formData);

    const rawEmployeeId = formData.get("employeeId");

    // ✅ Add prefix safely
    const employeeId = rawEmployeeId ? `CTSL${rawEmployeeId}` : null;


    
    // Extract all fields properly
    const data = {
      email: formData.get("email"),
      employeeId: employeeId,
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      designation: formData.get("designation"),
      department: formData.get("department"),
      employmentType: formData.get("employmentType"),
      workLocation: formData.get("workLocation"),
      dateOfJoining: formData.get("dateOfJoining"),

      gender: formData.get("gender"),
      dateOfBirth: formData.get("dateOfBirth"),
      bloodGroup: formData.get("bloodGroup"),
      fatherName: formData.get("fatherName"),
      motherName: formData.get("motherName"),
      spouseName: formData.get("spouseName"),

      bankName: formData.get("bankName"),
      accountNo: formData.get("accountNo"),
      ifscCode: formData.get("ifscCode"),
      panNumber: formData.get("panNumber"),
      uanNo: formData.get("uanNo"),
      esicNo: formData.get("esicNo"),

      currentAddress: formData.get("currentAddress"),
      permanentAddress: formData.get("permanentAddress"),
      city: formData.get("city"),
      state: formData.get("state"),
      country: formData.get("country"),
      pincode: formData.get("pincode"),

      emergencyContactName: formData.get("emergencyContactName"),
      emergencyContactPhone: formData.get("emergencyContactPhone"),
      emergencyContactRelation: formData.get("emergencyContactRelation"),

      reportingManagerName: formData.get("reportingManagerName"),
    };

    // Profile image uploade  and Process to store in the db
    const file = formData.get("profileImage");

    let profileImageUrl = null;
    let profileImagePublicId = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "hrms/profile-images",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      profileImageUrl = uploadResult.secure_url;
      profileImagePublicId = uploadResult.public_id;

      // console.log("Uploaded to Cloudinary:", profileImageUrl);
    }

    // 🔐 Default password
    const hashedPassword = await bcrypt.hash("1111", 10);

    // 💰 Create Financial Details
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: Role.EMPLOYEE,

          profileImageUrl: profileImageUrl, // ✅ ADD THIS
          profileImagePublicId: profileImagePublicId, // ✅ ADD THIS

          employeeId: data.employeeId,
          fullName: data.fullName,
          phone: data.phone,
          designationId: data.designation || null,
          departmentId: data.department || null,
          employmentType: data.employmentType || null,
          workLocation: data.workLocation || null,
          dateOfJoining: new Date(data.dateOfJoining),

          gender: data.gender || null,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          fatherName: data.fatherName || null,
          motherName: data.motherName || null,
          spouseName: data.spouseName || null,
          bloodGroup: data.bloodGroup || null,

          currentAddress: data.currentAddress || null,
          permanentAddress: data.permanentAddress || null,
          city: data.city || null,
          state: data.state || null,
          country: data.country || null,
          pincode: data.pincode || null,

          emergencyContactName: data.emergencyContactName || null,
          emergencyContactPhone: data.emergencyContactPhone || null,
          emergencyContactRelation: data.emergencyContactRelation || null,

          reportingManagerName: data.reportingManagerName || null,

          organizationId: organizationId,
        },
      });

      await tx.financialDetails.create({
        data: {
          bankName: data.bankName || null,
          accountNo: data.accountNo || null,
          ifscCode: data.ifscCode || null,
          panNumber: data.panNumber || null,
          uanNo: data.uanNo || null,
          esicNo: data.esicNo || null,
          userId: user.id,
        },
      });

      await tx.payrollSettings.create({
        data: {
          userId: user.id,
        },
      });

      const currentYear = new Date().getFullYear();
      await tx.leaveBalance.createMany({
        data: [
          {
            userId: user.id,
            leaveType: "PAID_LEAVE",
            allocated: 20,
            used: 0,
            remaining: 20,
            year: currentYear,
          },
          {
            userId: user.id,
            leaveType: "SICK_LEAVE",
            allocated: 10,
            used: 0,
            remaining: 10,
            year: currentYear,
          },
          {
            userId: user.id,
            leaveType: "CASUAL_LEAVE",
            allocated: 10,
            used: 0,
            remaining: 10,
            year: currentYear,
          },
          {
            userId: user.id,
            leaveType: "BEREAVEMENT_LEAVE",
            allocated: 5,
            used: 0,
            remaining: 5,
            year: currentYear,
          },
          {
            userId: user.id,
            leaveType: "OPTIONAL_LEAVE",
            allocated: 2,
            used: 0,
            remaining: 2,
            year: currentYear,
          },
          {
            userId: user.id,
            leaveType: "PATERNITY_LEAVE",
            allocated: 2,
            used: 0,
            remaining: 2,
            year: currentYear,
          },
          {
            userId: user.id,
            leaveType: "MATERNITY_LEAVE",
            allocated: 2,
            used: 0,
            remaining: 2,
            year: currentYear,
          },
        ],
      });

      return user;
    });

    console.log("The new uers is created :", newUser);

    try {
      // Send welcome email
      await resend.emails.send({
        from: "Crusharders <noreply@odishabiz.com>",
        to: data.email,
        subject: "Welcome to the Crusharders Team 🎉",
        html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Welcome to Crusharders</title>
    </head>

    <body style="margin:0;padding:0;background-color:#eef1f7;font-family:'Segoe UI',Roboto,Arial,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">

            <table width="620" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:14px;overflow:hidden;
              box-shadow:0 12px 30px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="background:#3454d1;padding:35px;text-align:center;">
                  <img
                    src="https://crushaderstech.com/images/logo/logo.webp"
                    alt="Crusharders Logo"
                    width="140"
                    style="display:block;margin:0 auto 10px;"
                  />
                  <p style="margin:0;color:#dbe2ff;font-size:14px;">
                    Welcome to Crusharders
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 45px;color:#2c2c2c;font-size:15px;line-height:1.6;">
                  <h2 style="margin-top:0;">
                    Hey ${data.fullName}, Welcome to Crusharders!
                  </h2>

                  <p>We’re excited to have you on board.</p>
                  <p>Your account has been successfully created.</p>
                  <p>If you have any questions, feel free to reach out to the team.</p>

                  <br/>
                  <p>
                    — <strong>Crusharders Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f5f7fc;padding:15px;text-align:center;
                  font-size:12px;color:#777;">
                  © ${new Date().getFullYear()} Crusharders. All rights reserved.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `,
      });
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Create user error:", error);

    // Prisma unique constraint error
    if (error.code === "P2002") {
      const target = error.meta?.target || [];

      let message = "Duplicate entry";

      if (target.includes("email")) {
        message = "Email already exists";
      } else if (target.includes("employeeId")) {
        message = "Employee ID already exists";
      } else if (target.includes("employeeId") && target.includes("organizationId")) {
        message = "Employee ID already exists in this organization";
      }

      return NextResponse.json({ success: false, message }, { status: 409 });
    }

    return NextResponse.json(
      { success: false, message: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

// export async function GET(request) {
//   try {
//     // 1️⃣ Validate token
//     const token = request.cookies.get("auth_token")?.value;
//     if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const decoded = verifyToken(token);
//     if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         fullName: true,
//         designation: true,
//         email: true,
//         phone: true,
//         department: true,
//         employeeId: true,
//         profileImageUrl: true,
//         lastLoginAt: true,
//         organization: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       users: users,
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         error: "Failed to fetch users",
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }

export async function GET(request) {
  try {
    // 1️⃣ Validate token
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // ✅ 2️⃣ Get query param
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");

    // ✅ 3️⃣ Build filter condition
    const whereCondition = {};

    if (departmentId) {
      whereCondition.departmentId = departmentId;
    }

    // ✅ 4️⃣ Fetch users with filter
    const users = await prisma.user.findMany({
      where: whereCondition, // 🔥 dynamic filter
      select: {
        id: true,
        fullName: true,
        designation: true,
        email: true,
        phone: true,
        department: true,
        employeeId: true,
        profileImageUrl: true,
        lastLoginAt: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch users",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
