import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string, name?: string) {
  const fromName = process.env.SMTP_FROM || "Platvo <noreply@platvo.com>";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="background:#111111;border-radius:16px;border:1px solid #222222;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;border-bottom:1px solid #1a1a1a;">
              <p style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                🟣 Platvo.ai
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                Verify your email
              </h1>
              <p style="margin:0 0 32px;font-size:15px;color:#888888;line-height:1.6;">
                Hi${name ? ` ${name}` : ""},<br/>
                Use the code below to verify your email and activate your Platvo account.
                This code is valid for <strong style="color:#cccccc;">10 minutes</strong>.
              </p>
              <!-- OTP Box -->
              <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:32px;text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:2px;color:#666666;text-transform:uppercase;">
                  Verification Code
                </p>
                <p style="margin:0;font-size:48px;font-weight:700;color:#a855f7;letter-spacing:16px;font-family:'Courier New',monospace;">
                  ${otp}
                </p>
              </div>
              <p style="margin:0;font-size:13px;color:#555555;line-height:1.6;">
                If you did not create an account with Platvo, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #1a1a1a;">
              <p style="margin:0;font-size:12px;color:#444444;line-height:1.6;">
                © ${new Date().getFullYear()} Platvo.ai · Sent from <a href="https://platvo.com" style="color:#666666;text-decoration:none;">platvo.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await transporter.sendMail({
    from: fromName,
    to,
    subject: `${otp} is your Platvo verification code`,
    html,
  });
}
