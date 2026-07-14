export function welcomeUserTemplate(fullName) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#eef1f7;font-family:'Segoe UI',Arial,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">

            <table width="620"
              style="background:#ffffff;border-radius:14px;overflow:hidden;
              box-shadow:0 10px 25px rgba(0,0,0,.08);">

              <tr>
                <td
                  style="background:#3454d1;
                  padding:35px;
                  text-align:center;">

                  <img
                    src="https://crushaderstech.com/images/logo/logo.webp"
                    width="150"
                  />

                  <p style="color:white;">
                    Welcome to Crushaders Tech Solutions
                  </p>

                </td>
              </tr>

              <tr>

                <td
                  style="padding:40px;">

                  <h2>
                    Welcome ${fullName}
                  </h2>

                  <p>

                    Your employee account has been created successfully.

                  </p>

                  <p>

                    Your HR administrator will share your login credentials shortly.

                  </p>

                  <br>

                  <p>

                    Regards,

                  </p>

                  <strong>

                    HR Team

                  </strong>

                </td>

              </tr>

              <tr>

                <td
                  style="
                  background:#f4f6fb;
                  text-align:center;
                  padding:18px;
                  font-size:12px;
                  color:#777;
                  ">

                  © ${new Date().getFullYear()} Crushaders Tech Solutions

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