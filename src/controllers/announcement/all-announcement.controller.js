import { getAllAnnouncementService } from "@/services/announcement/all-announcement.service";

export async function getAllAnnouncementController(currentUser) {
    const allAnnouncements = await getAllAnnouncementService(currentUser);

    return {
        success: true,
        message: "Announcements fetched successfully",
        data: allAnnouncements,
    };
    
}