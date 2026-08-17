import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getDashboardService(currentUser) {
  try {
    const organizationId = currentUser.organizationId;

    const [users, approvedLeavesThisMonth, notificationsThisMonth, pendingLeaves] =
      await Promise.all([
        prisma.user.findMany({
          where: {
            organizationId,
            isDeleted: false,
            status: "ACTIVE",
          },
          select: {
            id: true,
            employeeId: true,
            fullName: true,
            profileImageUrl: true,
            dateOfBirth: true,
            dateOfJoining: true,
            department: {
              select: {
                name: true,
              },
            },
            employmentType: true,
            status: true,
          },
        }),

        prisma.leaveApplication.count({
          where: {
            status: "APPROVED",
            user: {
              organizationId,
            },
          },
        }),

        prisma.announcement.count({
          where: {
            organizationId,
          },
        }),

        prisma.leaveApplication.count({
          where: {
            status: "PENDING",
            user: {
              organizationId,
            },
          },
        }),
      ]);

    const totalEmployees = users.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingBirthdays = users
      .filter((u) => u.dateOfBirth)
      .map((user) => {
        const dob = new Date(user.dateOfBirth);

        let nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        return { ...user, birthdayDate: nextBirthday };
      })
      .sort((a, b) => a.birthdayDate - b.birthdayDate)
      .slice(0, 5)
      .map((user) => {
        const isToday = user.birthdayDate.toDateString() === today.toDateString();

        return {
          ...user,
          formattedDate: isToday
            ? "Today 🎉"
            : user.birthdayDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
              }),
        };
      });

    const upcomingAnniversaries = users
      .filter((u) => u.dateOfJoining)
      .map((user) => {
        const doj = new Date(user.dateOfJoining);

        let nextAnniversary = new Date(today.getFullYear(), doj.getMonth(), doj.getDate());

        if (nextAnniversary < today) {
          nextAnniversary.setFullYear(today.getFullYear() + 1);
        }

        let yearsCompleted = today.getFullYear() - doj.getFullYear();
        if (nextAnniversary > today) {
          yearsCompleted--;
        }

        return {
          ...user,
          anniversaryDate: nextAnniversary,
          yearsCompleted: yearsCompleted < 0 ? 0 : yearsCompleted,
        };
      })
      .sort((a, b) => a.anniversaryDate - b.anniversaryDate)
      .slice(0, 4)
      .map((user) => {
        const isToday = user.anniversaryDate.toDateString() === today.toDateString();

        return {
          ...user,
          formattedDate: isToday
            ? "Today 🎉"
            : user.anniversaryDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
              }),
          isToday,
        };
      });

    const groupCount = (data, key) => {
      return Object.values(
        data.reduce((acc, item) => {
          let value = item[key];

          if (value && typeof value === "object") {
            value = value.name;
          }

          value = value || "Unknown";

          if (!acc[value]) {
            acc[value] = { name: value, value: 0 };
          }

          acc[value].value += 1;

          return acc;
        }, {})
      );
    };
    const charts = {
      department: groupCount(users, "department"),
      employmentType: groupCount(users, "employmentType"),
      status: groupCount(users, "status"),
    };

    return {
      cardsinfo: {
        totalEmployees,
        approvedLeavesThisMonth,
        notificationsThisMonth,
        pendingLeaves,
      },
      birthdayinfo: upcomingBirthdays,
      anniversaryinfo: upcomingAnniversaries,
      charts,
    };
  } catch (error) {
    console.error("Get Dashboard Data Service Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const customError = new Error("Database operation failed.");

      customError.statusCode = 500;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      const customError = new Error("Database validation failed.");

      customError.statusCode = 500;

      throw customError;
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      const customError = new Error("Database connection failed");

      customError.statusCode = 500;

      throw customError;
    }

    throw error;
  }
}
