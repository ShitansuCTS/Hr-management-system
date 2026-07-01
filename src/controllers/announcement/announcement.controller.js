import { validateCreateAnnouncement } from "@/validations/announcement.validation";
import { createAnnouncementService,getAnnouncementService } from "@/services/announcement/announcement.service";

export async function createAnnouncementController(body, currentUser){

    const announcementData = validateCreateAnnouncement(body);

    const announcement = await createAnnouncementService(announcementData, currentUser);

    return {
        success: true,
        message: "Announcement created successfully",
        data: announcement,
    };
}

export async function getAnnouncementController() {
    const announcemnets = await getAnnouncementService();

    return {
        success: true,
        message: "Announcements fetched successfully",
        data: announcemnets,
    };
    
}

