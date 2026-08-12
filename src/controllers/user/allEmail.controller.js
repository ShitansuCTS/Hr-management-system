import { getAllEmailsService } from "@/services/user/email/allEmail.service";

export async function getAllEmailsController(currentUser) {
  const emails = await getAllEmailsService(currentUser);

  return {
    success: true,
    message: "All emails fetched successfully",
    data: emails,
  };
}
