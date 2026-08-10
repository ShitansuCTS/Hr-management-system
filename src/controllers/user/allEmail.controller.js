import { getAllEmailsSerrvice } from "@/services/user/email/allEmail.service";

export async function getAllEmailsController(currentUser) {
  const emails = await getAllEmailsSerrvice(currentUser);

  return {
    success: true,
    message: "All emails fetched successfully",
    data: emails,
  };
}
