import { randomUUID } from "crypto";
import { DEFAULT_LEAVE_BALANCES } from "@/config/defaultLeaveBalances";
import { Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function createBatchObjects(employee, currentUser, batch, currentYear) {
  const userId = randomUUID();

  const hashedPassword = await bcrypt.hash(process.env.DEFAULT_USER_PASSWORD, 10);

  /*
  ==========================================
      User
  ==========================================
  */

  const user = {
    id: userId,

    organizationId: currentUser.organizationId,

    employeeId: `CTSL${employee.employeeId}`,

    fullName: employee.fullName,

    email: employee.email,

    password: hashedPassword,

    phone: employee.phone,

    designationId: employee.designationId,

    departmentId: employee.departmentId,

    employmentType: employee.employmentType,

    workLocation: employee.workLocation,

    dateOfJoining: employee.dateOfJoining,

    gender: employee.gender,

    dateOfBirth: employee.dateOfBirth,

    bloodGroup: employee.bloodGroup,

    fatherName: employee.fatherName,

    motherName: employee.motherName,

    spouseName: employee.spouseName,

    currentAddress: employee.currentAddress,

    permanentAddress: employee.permanentAddress,

    city: employee.city,

    state: employee.state,

    country: employee.country,

    pincode: employee.pincode,

    emergencyContactName: employee.emergencyContactName,

    emergencyContactPhone: employee.emergencyContactPhone,

    emergencyContactRelation: employee.emergencyContactRelation,

    reportingManagerName: employee.reportingManagerName,

    role: Role.EMPLOYEE,

    status: UserStatus.ACTIVE,
  };

  /*
  ==========================================
      Financial Details
  ==========================================
  */

  const financial = {
    id: randomUUID(),

    userId,

    bankName: employee.bankName,

    accountNo: employee.accountNo,

    ifscCode: employee.ifscCode,

    panNumber: employee.panNumber,

    uanNo: employee.uanNo,

    esicNo: employee.esicNo,
  };

  /*
  ==========================================
      Leave Balances
  ==========================================
  */

  const leaveBalances = DEFAULT_LEAVE_BALANCES.map((leave) => ({
    id: randomUUID(),

    userId,

    leaveType: leave.leaveType,

    allocated: leave.allocated,

    used: 0,

    remaining: leave.allocated,

    year: currentYear,
  }));

  batch.data.employees.push({
    user,
    financial,
    leaveBalances,
  });
}
