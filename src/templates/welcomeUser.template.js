import { brandedEmailLayout, escapeHtml } from "./emailLayout";

export function welcomeUserTemplate(fullName) {
  const safeName = escapeHtml(fullName || "there");

  return brandedEmailLayout({
    preheader: "Your employee account has been created successfully.",
    eyebrow: "Employee account",
    title: `Welcome, ${safeName}`,
    content: `
  <p style="margin:0 0 16px;">
    Your employee account has been created successfully.
  </p>
  <p style="margin:0 0 20px;">
    Your HR administrator will share your login credentials with you shortly.
    Once you receive them, you can log in to your employee dashboard using the link below.
    If you have any questions, please contact your HR team.
  </p>
  <p style="margin:0 0 20px;">
    <a href="${process.env.BASE_URL}/authentication/login"
       style="color:#2563eb;font-weight:600;text-decoration:none;">
      Login to Your Employee Dashboard
    </a>
  </p>
  <p style="margin:0 0 20px;">We’re glad to have you on the team.</p>
  <p style="margin:0;">
    Best regards,<br>
    <strong style="color:#202939;">HR Team</strong>
  </p>
`,
    actionLabel: "Visit our website",
    actionUrl: "https://crushaderstech.com",
  });
}
