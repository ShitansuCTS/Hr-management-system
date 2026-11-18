import { brandedEmailLayout, escapeHtml } from "./emailLayout";

export function passwordResetTemplate(fullName, resetLink) {
  const safeName = escapeHtml(fullName || "there");
  const safeResetLink = escapeHtml(resetLink);

  return brandedEmailLayout({
    preheader: "Use the secure link to reset your account password.",
    eyebrow: "Account security",
    title: "Reset your password",
    content: `
      <p style="margin:0 0 16px;">Hello ${safeName},</p>
      <p style="margin:0 0 20px;">
        We received a request to reset the password for your account.
        Use the button below to choose a new password.
      </p>
      <p style="margin:0 0 16px;color:#667085;font-size:13px;">
        This link expires in 15 minutes and can only be used once.
      </p>
    `,
    actionLabel: "Reset password",
    actionUrl: resetLink,
    note: `
      If you didn’t request a password reset, you can safely ignore this email.
      Your password will remain unchanged.
      <br><br>
      If the button doesn’t work, copy and paste this link into your browser:<br>
      <a href="${safeResetLink}" style="color:#3454d1;word-break:break-all;">
        ${safeResetLink}
      </a>
    `,
  });
}
