export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth } from "@/auth/requireAuth";
import { prisma } from "@/lib/prisma";
import { createSignedUrl } from "@/services/storage/createSignedUrl.service";
import { getOrganizationBucket } from "@/utils/storage/getOrganizationBucket";

export async function GET(request) {
  try {
    const auth = await requireAuth(request, ["ADMIN", "EMPLOYEE"]);
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: auth.user.id,
      },
      include: {
        financialDetails: true,
        department: true,
        designation: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Profile not found." },
        { status: 404 }
      );
    }

    const formattedUser = {
      ...user,
      password: undefined,
      resetPasswordToken: undefined,
      resetPasswordExpires: user.resetPasswordExpires
        ? user.resetPasswordExpires.toString()
        : null,
    };




    // Generate Supabase Signed Profile Image URL
    let profileImageUrl = null;

    if (user.profileImageUrl) {
      try {
        const bucket = getOrganizationBucket(user.organizationId);

        const storagePath = user.profileImageUrl
          .replace(/\n/g, "")
          .trim();

        const signedUrl = await createSignedUrl({
          bucket,
          storagePath,
          expiresIn: 300,
        });

        profileImageUrl = signedUrl.signedUrl;

      } catch (error) {
        if (error.code === "STORAGE_OBJECT_NOT_FOUND") {
          try {
            await prisma.user.updateMany({
              where: {
                id: user.id,
                organizationId: user.organizationId,
                profileImageUrl: user.profileImageUrl,
              },
              data: {
                profileImageUrl: null,
              },
            });
          } catch (cleanupError) {
            console.error("Failed to clear stale profile image reference:", {
              userId: user.id,
              message: cleanupError.message,
            });
          }
        } else {
          console.error("Failed to generate profile image URL:", {
            userId: user.id,
            organizationId: user.organizationId,
            message: error.message,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        ...formattedUser,
        profileImageUrl,
      },
    });
  } catch (error) {
    console.error("Get Current User Profile Route Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch profile." },
      { status: error.statusCode || 500 }
    );
  }
}
