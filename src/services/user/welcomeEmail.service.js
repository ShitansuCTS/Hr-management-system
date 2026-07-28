import { Resend } from "resend";

import { welcomeUserTemplate } from "@/templates/welcomeUser.template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(user) {
  try {
    await resend.emails.send({
      from: "HR Team <hr@odishabiz.com>",

      to: user.email,

      subject: "Welcome to the Team",

      html: welcomeUserTemplate(user.fullName),
    });
  } catch (error) {
    console.error("Welcome Email:", error);
  }
}
