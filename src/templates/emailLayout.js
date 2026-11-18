const WEBSITE_URL = "https://crushaderstech.com";
const LOGO_URL = `${WEBSITE_URL}/images/logo/logo.webp`;
const LINKEDIN_URL =
  "https://www.linkedin.com/company/crushaders-tech-solutions-llp/posts/?feedView=all";

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export function brandedEmailLayout({
  preheader,
  eyebrow,
  title,
  content,
  actionLabel,
  actionUrl,
  note,
}) {
  const action = actionLabel && actionUrl
    ? `
      <tr>
        <td align="center" style="padding:8px 0 24px;">
          <a href="${escapeHtml(actionUrl)}"
            style="display:inline-block;background:#3454d1;color:#ffffff;
            text-decoration:none;font-size:15px;font-weight:600;
            padding:14px 28px;border-radius:7px;">
            ${escapeHtml(actionLabel)}
          </a>
        </td>
      </tr>
    `
    : "";
  const noteRow = note
    ? `
      <tr>
        <td style="padding:0 36px 30px;color:#667085;font-size:13px;
          line-height:1.6;text-align:center;">
          ${note}
        </td>
      </tr>
    `
    : "";

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0;padding:0;background:#f3f5fa;
        font-family:Arial,Helvetica,sans-serif;color:#202939;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
          ${escapeHtml(preheader)}
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="background:#f3f5fa;padding:36px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0"
                style="width:100%;max-width:600px;background:#ffffff;
                border-radius:12px;overflow:hidden;">
                <tr>
                  <td align="center" style="background:#3454d1;padding:26px 32px;">
                    <a href="${WEBSITE_URL}" style="text-decoration:none;">
                      <img src="${LOGO_URL}" width="150" alt="Crushaders Tech Solutions"
                        style="display:block;width:150px;max-width:100%;height:auto;border:0;">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:34px 36px 10px;">
                    <p style="margin:0 0 10px;color:#3454d1;font-size:12px;
                      font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                      ${escapeHtml(eyebrow)}
                    </p>
                    <h1 style="margin:0 0 20px;color:#182230;font-size:26px;
                      line-height:1.3;font-weight:700;">
                      ${title}
                    </h1>
                    <div style="color:#475467;font-size:15px;line-height:1.7;">
                      ${content}
                    </div>
                  </td>
                </tr>
                ${action}
                ${noteRow}
                <tr>
                  <td style="border-top:1px solid #eaecf0;background:#fafbfc;
                    padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 10px;color:#667085;font-size:12px;line-height:1.6;">
                      <a href="${WEBSITE_URL}" style="color:#3454d1;text-decoration:none;">
                        crushaderstech.com
                      </a>
                      &nbsp;&middot;&nbsp;
                      <a href="${LINKEDIN_URL}" style="color:#3454d1;text-decoration:none;">
                        LinkedIn
                      </a>
                    </p>
                    <p style="margin:0;color:#98a2b3;font-size:11px;line-height:1.5;">
                      &copy; ${new Date().getFullYear()} Crushaders Tech Solutions.
                      All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
