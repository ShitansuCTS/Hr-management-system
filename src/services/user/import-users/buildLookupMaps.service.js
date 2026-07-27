import { prisma } from "@/lib/prisma";
import { buildDesignationKey } from "@/utils/import-users/buildDesignationKey";

export async function buildLookupMaps(currentUser) {
  // Load everything in parallel
  const [users, departments, designations] = await Promise.all([
    prisma.user.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      select: {
        email: true,
        employeeId: true,
      },
    }),

    prisma.department.findMany({
      where: {
        organizationId: currentUser.organizationId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.designation.findMany({
      where: {
        organizationId: currentUser.organizationId,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        departmentId: true,
      },
    }),
  ]);

  // Existing Users
  const emailSet = new Set();
  const employeeIdSet = new Set();

  users.forEach((user) => {
    if (user.email) {
      emailSet.add(user.email.trim().toLowerCase());
    }

    if (user.employeeId) {
      employeeIdSet.add(user.employeeId.trim());
    }
  });

  // Departments
  const departmentMap = new Map();

  departments.forEach((department) => {
    departmentMap.set(department.name.trim().toLowerCase(), {
      id: department.id,
      name: department.name,
    });
  });

  // Designations
  const designationMap = new Map();

  designations.forEach((designation) => {
    designationMap.set(buildDesignationKey(designation.departmentId, designation.title), {
      id: designation.id,
      title: designation.title,
      departmentId: designation.departmentId,
    });
  });

  return {
    emailSet,
    employeeIdSet,
    departmentMap,
    designationMap,
  };
}
