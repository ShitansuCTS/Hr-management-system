export function announcementTemplate(mailBody) {
  return `
                        <div style="background-color:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
                    <table align="center" width="800" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;border-radius:10px;overflow:hidden;
                    box-shadow:0 6px 18px rgba(0,0,0,0.08);">
    
                    <!-- HEADER -->
                    <tr>
              <td style="background:#3454d1;padding:24px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="left">
                      <img
                        src="https://crushaderstech.com/images/logo/logo.webp"
                        alt="Crusahders Tech Solutions"
                        width="140"
                        style="display:block;"
                      />
                    </td>
                    <td align="right" style="color:#ffffff;">
                      <span style="font-size:14px;opacity:0.9;">
                        HR Announcement
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
    
            <!-- BODY -->
            <tr>
              <td style="padding:35px 30px;color:#333333;">
                <p style="font-size:15px;margin:0 0 18px;">
                  Dear Team,
                  Greetings!
                </p>
    
                <div style="font-size:14px;line-height:1.7;color:#444444;">
                  ${mailBody}
                </div>
    
                <p style="font-size:14px;margin:30px 0 0;">
                  Best regards,<br />
                  <strong>HR Team</strong><br />
                  Crusahders Tech Solutions
                </p>
              </td>
            </tr>
    
            <!-- DIVIDER -->
            <tr>
              <td style="padding:0 30px;">
                <hr style="border:none;border-top:1px solid #e5e7eb;" />
              </td>
            </tr>
    
            <!-- FOOTER -->
            <tr>
              <td style="padding:20px 30px;background:#f8f9fb;text-align:center;">
                <p style="font-size:12px;color:#777777;margin:0 0 12px;">
                  © 2026 Crusahders Tech Solutions. All rights reserved.
                </p>
    
                <!-- SOCIAL ICONS -->
                <table align="center" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:0 6px;">
                      <a href="https://www.linkedin.com/company/crushaders-tech-solutions-llp/posts/?feedView=all" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/24/174/174857.png"
                          width="20" alt="LinkedIn" />
                      </a>
                    </td>
                    <td style="padding:0 6px;">
                      <a href="https://x.com/i/flow/login?redirect_after_login=%2Fsearch%3Fq%3D%2523Crushaders_Tech%26src%3Dhashtag_click" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/24/733/733579.png"
                          width="20" alt="Twitter" />
                      </a>
                    </td>
                    <td style="padding:0 6px;">
                      <a href="https://crushaderstech.com" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/24/841/841364.png"
                          width="20" alt="Website" />
                      </a>
                    </td>
                  </tr>
                </table>
    
                <p style="font-size:11px;color:#999999;margin:12px 0 0;">
                  This is an automated message from the <span style="color:#0d6efd;">HRMS system</span>.<br />
                  Please do not reply to this email.
                </p>
              </td>
            </tr>
    
          </table>
        </div>
    
    `;
}
