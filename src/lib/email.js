import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
    try {
        await resend.emails.send({
            from: "Crusharders <admin@testctsl.in>",
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Email sending failed:", error);
    }
}