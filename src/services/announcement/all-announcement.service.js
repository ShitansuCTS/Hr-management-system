import { prisma } from "@/lib/prisma";

export async function getAllAnnouncementService(currentUser) {

  let allAnnouncements;

  if (currentUser.role === "ADMIN") {
    //ADMIN → all allAnnouncements in org
    allAnnouncements = await prisma.announcement.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImageUrl: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (currentUser.role === "EMPLOYEE") {
    // EMPLOYEE → only allowed ones
    allAnnouncements = await prisma.announcement.findMany({
      where: {
        organizationId: currentUser.organizationId,
        OR: [
          { sendType: "ALL" },
          {
            recipients: {
              some: {
                userId: currentUser.id,
              },
            },
          },
        ],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImageUrl: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    const error = new Error("Unauthorized role");

    error.statusCode = 403;

    throw error;
  }

  return allAnnouncements;
}
