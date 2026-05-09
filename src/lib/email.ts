import { Resend } from 'resend'

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const displayName = userName && userName !== '用户' ? userName : 'there'

  return await resend.emails.send({
    from: 'FitAI <hello@fittryon.site>',
    to: userEmail,
    subject: 'Welcome to FitAI',
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f5f5f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:48px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">

    <!-- Header -->
    <div style="background:#1a1a1a;padding:32px 40px;">
      <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">FitAI</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">
        Welcome, ${displayName}
      </h1>
      <p style="margin:0 0 24px;font-size:15px;color:#6b6b6b;line-height:1.6;">
        You're all set. FitAI lets you try on any outfit before you buy — no changing room needed.
      </p>

      <div style="background:#f7f7f5;border-radius:12px;padding:24px;margin-bottom:28px;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#1a1a1a;text-transform:uppercase;letter-spacing:0.08em;">How it works</p>
        <p style="margin:0 0 8px;font-size:14px;color:#4b4b4b;line-height:1.5;">
          <span style="font-weight:600;color:#1a1a1a;">1.</span>&nbsp; Upload a photo of yourself
        </p>
        <p style="margin:0 0 8px;font-size:14px;color:#4b4b4b;line-height:1.5;">
          <span style="font-weight:600;color:#1a1a1a;">2.</span>&nbsp; Upload a clothing image
        </p>
        <p style="margin:0;font-size:14px;color:#4b4b4b;line-height:1.5;">
          <span style="font-weight:600;color:#1a1a1a;">3.</span>&nbsp; Our AI generates a photorealistic try-on in seconds
        </p>
      </div>

      <!-- CTA Button -->
      <a href="https://fittryon.site/tryon"
         style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 28px;border-radius:10px;letter-spacing:0.01em;">
        Try it now →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding:20px 40px;border-top:1px solid #e5e5e5;">
      <p style="margin:0;font-size:12px;color:#b4b4b4;">
        You're receiving this because you created a FitAI account.
      </p>
    </div>

  </div>
</body>
</html>
    `,
  })
}
